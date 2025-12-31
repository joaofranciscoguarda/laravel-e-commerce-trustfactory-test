<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart()->with('items.item')->first();

            return Inertia::render('Cart/Index', [
                'cart' => $cart,
                'items' => $cart?->items ?? [],
                'total' => $cart?->getTotal() ?? 0,
                'count' => $cart?->getItemCount() ?? 0,
            ]);
        }

        // Guest cart from session
        $sessionCart = session('cart', []);
        $items = [];
        $total = 0;

        foreach ($sessionCart as $itemId => $quantity) {
            $item = Item::find($itemId);
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

        return Inertia::render('Cart/Index', [
            'cart' => null,
            'items' => $items,
            'total' => $total,
            'count' => array_sum($sessionCart),
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = Item::findOrFail($request->item_id);

        if (! $item->hasStock($request->quantity)) {
            return back()->with('error', 'Insufficient stock available');
        }

        if (auth()->check()) {
            $cart = auth()->user()->getOrCreateCart();
            $cart->addItem($item, $request->quantity);
        } else {
            // Guest: store in session
            $sessionCart = session('cart', []);
            $sessionCart[$item->id] = ($sessionCart[$item->id] ?? 0) + $request->quantity;
            session(['cart' => $sessionCart]);
        }

        return back()->with('success', 'Item added to cart');
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        if (auth()->check()) {
            $cart = auth()->user()->cart;

            if (! $cart) {
                return back()->with('error', 'Cart not found');
            }

            if ($request->quantity === 0) {
                $cart->removeItem($item);

                return back()->with('success', 'Item removed from cart');
            }

            if (! $item->hasStock($request->quantity)) {
                return back()->with('error', 'Insufficient stock available');
            }

            $cart->updateItemQuantity($item, $request->quantity);
        } else {
            // Guest: update session
            $sessionCart = session('cart', []);

            if ($request->quantity === 0) {
                unset($sessionCart[$item->id]);
                session(['cart' => $sessionCart]);

                return back()->with('success', 'Item removed from cart');
            }

            if (! $item->hasStock($request->quantity)) {
                return back()->with('error', 'Insufficient stock available');
            }

            $sessionCart[$item->id] = $request->quantity;
            session(['cart' => $sessionCart]);
        }

        return back()->with('success', 'Cart updated');
    }

    public function remove(Item $item): RedirectResponse
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart;

            if (! $cart) {
                return back()->with('error', 'Cart not found');
            }

            $cart->removeItem($item);
        } else {
            // Guest: remove from session
            $sessionCart = session('cart', []);
            unset($sessionCart[$item->id]);
            session(['cart' => $sessionCart]);
        }

        return back()->with('success', 'Item removed from cart');
    }

    public function clear(): RedirectResponse
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart;

            if ($cart) {
                $cart->clear();
            }
        } else {
            // Guest: clear session
            session()->forget('cart');
        }

        return back()->with('success', 'Cart cleared');
    }

    public function count(): JsonResponse
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart;
            $count = $cart?->getItemCount() ?? 0;
        } else {
            // Guest: count from session
            $sessionCart = session('cart', []);
            $count = array_sum($sessionCart);
        }

        return response()->json(['count' => $count]);
    }
}
