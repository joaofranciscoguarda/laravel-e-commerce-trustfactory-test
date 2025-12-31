<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = auth()->user()
            ->orders()
            ->with(['items.item'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        if (! Gate::allows('view', $order)) {
            abort(403, 'Unauthorized to view this order.');
        }

        $order->load(['items.item', 'items.batch']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
