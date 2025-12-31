<?php

namespace App\Mail;

use App\Models\Item;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowStockNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Item $item) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Low Stock Alert: {$this->item->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock-notification',
            with: [
                'item' => $this->item,
                'availableStock' => $this->item->available_stock,
                'threshold' => $this->item->low_stock_threshold,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
