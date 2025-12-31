<?php

namespace App\Jobs;

use App\Mail\DailySalesReport as DailySalesReportMail;
use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ?string $date = null)
    {
        $this->date = $date ?? now()->format('Y-m-d');
    }

    public function handle(): void
    {
        $admin = User::where('email', 'admin@darkfantasy.com')->first();

        if (! $admin) {
            return;
        }

        $orders = Order::with(['user', 'items.item'])
            ->whereDate('created_at', $this->date)
            ->get();

        $totalRevenue = $orders->sum('total');
        $totalItemsSold = $orders->flatMap(fn ($order) => $order->items)->sum('quantity');

        Mail::to($admin->email)->send(
            new DailySalesReportMail(
                $orders,
                $totalRevenue,
                $totalItemsSold,
                $this->date
            )
        );
    }
}
