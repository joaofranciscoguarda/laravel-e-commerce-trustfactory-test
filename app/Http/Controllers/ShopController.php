<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        $items = Item::active()
            ->inStock()
            ->with('batches')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $cartQuantities = $this->getCartQuantities();

        return Inertia::render('Shop/Index', [
            'items' => $items,
            'cartQuantities' => $cartQuantities,
        ]);
    }

    public function show(Item $item): Response
    {
        $item->load('batches');

        return Inertia::render('Shop/Show', [
            'item' => $item,
        ]);
    }

    public function search(Request $request): Response
    {
        $query = $request->input('q', '');

        $items = Item::active()
            ->inStock()
            ->when($query, function ($queryBuilder) use ($query) {
                $search = strtolower($query);
                $queryBuilder->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(title) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(author) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(description) like ?', ["%{$search}%"]);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        $cartQuantities = $this->getCartQuantities();

        return Inertia::render('Shop/Search', [
            'items' => $items,
            'query' => $query,
            'cartQuantities' => $cartQuantities,
        ]);
    }

    protected function getCartQuantities(): array
    {
        if (auth()->check()) {
            $cart = auth()->user()->cart()->with('items')->first();
            if ($cart) {
                return $cart->items->pluck('quantity', 'item_id')->toArray();
            }
        } else {
            return session('cart', []);
        }

        return [];
    }
}
