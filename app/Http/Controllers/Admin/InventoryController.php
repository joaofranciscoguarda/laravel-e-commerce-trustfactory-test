<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemDetailResource;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Item::query()->with('batches');

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Filter by stock status
        if ($request->filled('stock_filter')) {
            match ($request->input('stock_filter')) {
                'low' => $query->lowStock(),
                'out' => $query->where('available_stock', 0),
                'in_stock' => $query->where('available_stock', '>', 0),
                default => null,
            };
        }

        // Sort - default by available stock ascending (lowest first)
        $sortBy = $request->input('sort_by', 'stock');
        $sortDirection = $request->input('sort_direction', 'asc');

        match ($sortBy) {
            'stock' => $query->orderBy('available_stock', $sortDirection),
            'title' => $query->orderBy('title', $sortDirection),
            'price' => $query->orderBy('final_price', $sortDirection),
            default => $query->orderBy('available_stock', 'asc'),
        };

        $items = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/inventory/index', [
            'items' => ItemResource::collection($items),
            'filters' => [
                'search' => $request->input('search'),
                'stock_filter' => $request->input('stock_filter'),
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function show(Item $item): Response
    {
        $item->load(['batches' => function ($query) {
            $query->orderBy('received_date')->orderBy('id');
        }]);

        return Inertia::render('admin/inventory/show', [
            'item' => new ItemDetailResource($item),
        ]);
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $validated = $request->validate([
            'base_price' => ['required', 'numeric', 'min:0', 'max:9999.99'],
            'discount_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'low_stock_threshold' => ['required', 'integer', 'min:0', 'max:1000'],
        ]);

        $item->update([
            'base_price' => $validated['base_price'],
            'discount_percentage' => $validated['discount_percentage'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
        ]);

        // Recalculate final price
        $item->calculateFinalPrice();

        // Check if stock is zero and deactivate
        if ($item->available_stock === 0 && $item->is_active) {
            $item->update(['is_active' => false]);
        }

        return back()->with('success', 'Item updated successfully.');
    }

    public function toggleActive(Item $item): RedirectResponse
    {
        // Don't allow activating items with zero stock
        if (! $item->is_active && $item->available_stock === 0) {
            return back()->with('error', 'Cannot activate item with zero stock.');
        }

        $item->update(['is_active' => ! $item->is_active]);

        $status = $item->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Item {$status} successfully.");
    }
}
