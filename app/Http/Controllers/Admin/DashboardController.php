<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Today's revenue
        $todayRevenue = (float) Order::today()
            ->whereNotIn('status', ['cancelled'])
            ->sum('total');

        // Today's orders count
        $todayOrders = Order::today()
            ->whereNotIn('status', ['cancelled'])
            ->count();

        // Today's items sold
        $todayItemsSold = (int) Order::today()
            ->whereNotIn('status', ['cancelled'])
            ->withSum('items', 'quantity')
            ->get()
            ->sum('items_sum_quantity');

        // Total customers
        $totalCustomers = User::where('role', 'customer')->count();

        // Low stock items (5 most critical)
        $lowStockItems = Item::query()
            ->lowStock()
            ->where('is_active', true)
            ->orderBy('available_stock', 'asc')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'author' => $item->author,
                'available_stock' => $item->available_stock,
                'low_stock_threshold' => $item->low_stock_threshold,
                'image_path' => $item->image_path,
            ]);

        // Recent orders (5 most recent)
        $recentOrders = Order::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'todayRevenue' => round($todayRevenue, 2),
                'todayOrders' => $todayOrders,
                'todayItemsSold' => $todayItemsSold,
                'totalCustomers' => $totalCustomers,
            ],
            'lowStockItems' => $lowStockItems,
            'recentOrders' => $recentOrders,
        ]);
    }
}
