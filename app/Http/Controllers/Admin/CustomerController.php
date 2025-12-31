<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total');

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort - default by created_at descending (newest first)
        $sortBy = $request->input('sort_by', 'date');
        $sortDirection = $request->input('sort_direction', 'desc');

        match ($sortBy) {
            'date' => $query->orderBy('created_at', $sortDirection),
            'name' => $query->orderBy('name', $sortDirection),
            'orders' => $query->orderBy('orders_count', $sortDirection),
            'total_spent' => $query->orderBy('orders_sum_total', $sortDirection),
            default => $query->orderBy('created_at', 'desc'),
        };

        $customers = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers->through(fn ($customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'orders_count' => $customer->orders_count ?? 0,
                'total_spent' => (float) ($customer->orders_sum_total ?? 0),
                'created_at' => $customer->created_at->format('M d, Y'),
            ]),
            'filters' => [
                'search' => $request->input('search'),
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
            'totalCustomers' => User::where('role', 'customer')->count(),
        ]);
    }

    public function show(User $customer): Response
    {
        $customer->load(['orders' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('admin/customers/show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'email_verified_at' => $customer->email_verified_at?->format('M d, Y H:i'),
                'created_at' => $customer->created_at->format('M d, Y H:i'),
                'orders_count' => $customer->orders()->count(),
                'total_spent' => (float) $customer->orders()->sum('total'),
                'recent_orders' => $customer->orders->map(fn ($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ]),
            ],
        ]);
    }
}
