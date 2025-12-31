<?php

namespace App\Providers;

use App\Listeners\MergeGuestCart;
use App\Models\Item;
use App\Models\Order;
use App\Observers\ItemObserver;
use App\Policies\OrderPolicy;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Item::observe(ItemObserver::class);

        Event::listen(
            Login::class,
            MergeGuestCart::class,
        );

        Gate::policy(Order::class, OrderPolicy::class);
    }
}
