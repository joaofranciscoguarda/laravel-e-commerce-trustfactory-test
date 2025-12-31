<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

class DashboardController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->action([AdminDashboardController::class, 'index']);
        }

        // Get recent orders
        $recentOrders = $user->orders()
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at->format('M d, Y'),
            ]);

        // Get order stats
        $totalOrders = $user->orders()->count();
        $totalSpent = (float) $user->orders()->sum('total');
        $pendingOrders = $user->orders()->where('status', 'pending')->count();

        return Inertia::render('customer/dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'totalSpent' => round($totalSpent, 2),
                'pendingOrders' => $pendingOrders,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
