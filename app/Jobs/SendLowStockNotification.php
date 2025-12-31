<?php

namespace App\Jobs;

use App\Mail\LowStockNotification as LowStockNotificationMail;
use App\Models\Item;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Item $item) {}

    public function handle(): void
    {
        $admin = User::where('email', 'admin@darkfantasy.com')->first();

        if (! $admin) {
            return;
        }

        Mail::to($admin->email)->send(new LowStockNotificationMail($this->item));
    }
}
