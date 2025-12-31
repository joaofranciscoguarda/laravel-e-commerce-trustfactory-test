<?php

namespace App\Http\Controllers;

use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function index(): Response
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart()->with('items.item')->first();

            if (! $cart || $cart->isEmpty()) {
                return Inertia::render('Checkout/Empty');
            }

            return Inertia::render('Checkout/Index', [
                'cart' => $cart,
                'items' => $cart->items,
                'total' => $cart->getTotal(),
                'count' => $cart->getItemCount(),
            ]);
        }

        // Guest cart from session
        $sessionCart = session('cart', []);

        if (empty($sessionCart)) {
            return Inertia::render('Checkout/Empty');
        }

        $items = [];
        $total = 0;

        foreach ($sessionCart as $itemId => $quantity) {
            $item = \App\Models\Item::find($itemId);
            if ($item) {
                $items[] = [
                    'id' => $itemId,
                    'item_id' => $itemId,
                    'quantity' => $quantity,
                    'price_snapshot' => $item->final_price,
                    'item' => $item,
                ];
                $total += $item->final_price * $quantity;
            }
        }

        return Inertia::render('Checkout/Index', [
            'cart' => null,
            'items' => $items,
            'total' => $total,
            'count' => array_sum($sessionCart),
        ]);
    }

    public function store(): RedirectResponse
    {
        if (! auth()->check()) {
            return redirect()->route('login')->with('error', 'Please login to complete your order');
        }

        try {
            $order = $this->orderService->createOrderFromCart(auth()->user());

            // Refresh order with all relationships
            $order->load(['items.item', 'items.batch']);

            return redirect()
                ->route('orders.show', $order->id)
                ->with('success', 'Order received! You will receive a delivery code within 2 business days.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
