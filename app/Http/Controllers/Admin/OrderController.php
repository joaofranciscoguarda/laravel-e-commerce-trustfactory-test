<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query()->with('user:id,name,email');

        // Search by order number or customer name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Sort - default by created_at descending (newest first)
        $sortBy = $request->input('sort_by', 'date');
        $sortDirection = $request->input('sort_direction', 'desc');

        match ($sortBy) {
            'date' => $query->orderBy('created_at', $sortDirection),
            'total' => $query->orderBy('total', $sortDirection),
            'order_number' => $query->orderBy('order_number', $sortDirection),
            default => $query->orderBy('created_at', 'desc'),
        };

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => OrderResource::collection($orders),
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'date_from' => $request->input('date_from'),
                'date_to' => $request->input('date_to'),
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
            'statusCounts' => [
                // 'pending' => Order::pending()->count(),
                // 'processing' => Order::processing()->count(),
                // 'completed' => Order::completed()->count(),
                // 'cancelled' => Order::cancelled()->count(),
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user:id,name,email', 'items.item', 'items.batch']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ],
                'items' => $order->items->map(fn ($orderItem) => [
                    'id' => $orderItem->id,
                    'item_id' => $orderItem->item_id,
                    'title' => $orderItem->item_title,
                    'author' => $orderItem->item_author,
                    'quantity' => $orderItem->quantity,
                    'unit_price' => (float) $orderItem->unit_price,
                    'subtotal' => (float) $orderItem->subtotal,
                    'batch_number' => $orderItem->batch?->batch_number,
                    'image_path' => $orderItem->item?->image_path,
                ]),
                'subtotal' => (float) $order->subtotal,
                'discount' => (float) $order->discount,
                'total' => (float) $order->total,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'shipping_address' => $order->shipping_address,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,completed,cancelled'],
        ]);

        // Don't allow changing from completed or cancelled
        if (in_array($order->status, ['completed', 'cancelled'])) {
            return back()->with('error', 'Cannot change status of completed or cancelled orders.');
        }

        $order->update(['status' => $validated['status']]);

        return back()->with('success', 'Order status updated successfully.');
    }
}
