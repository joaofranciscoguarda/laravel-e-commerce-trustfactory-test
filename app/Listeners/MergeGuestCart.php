<?php

namespace App\Listeners;

use App\Models\Item;
use Illuminate\Auth\Events\Login;

class MergeGuestCart
{
    public function handle(Login $event): void
    {
        $user = $event->user;
        $sessionCart = session('cart', []);

        if (empty($sessionCart)) {
            return;
        }

        $cart = $user->getOrCreateCart();

        foreach ($sessionCart as $itemId => $quantity) {
            $item = Item::find($itemId);

            if ($item && $item->hasStock($quantity)) {
                $cart->addItem($item, $quantity);
            }
        }

        session()->forget('cart');
    }
}
