<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class DailySalesReport extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Collection $orders,
        public float $totalRevenue,
        public int $totalItemsSold,
        public string $date
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Daily Sales Report - {$this->date}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
            with: [
                'orders' => $this->orders,
                'totalRevenue' => $this->totalRevenue,
                'totalItemsSold' => $this->totalItemsSold,
                'date' => $this->date,
                'orderCount' => $this->orders->count(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
