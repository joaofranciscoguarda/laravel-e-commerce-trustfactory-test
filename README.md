# TrustFactory - Laravel E-commerce

Dark fantasy bookstore e-commerce with FIFO inventory management, user-based carts, and automated notifications.

## Requirements Met

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Cart tied to authenticated user | ✅ | Database carts with `user_id` foreign key |
| No session/localStorage | ✅ | All cart data in `carts` and `cart_items` tables |
| Laravel authentication | ✅ | Laravel Fortify with 2FA support |
| Low stock notification job | ✅ | Observer + queued job sends email to admin |
| Daily sales report cron | ✅ | Scheduled at 8 PM daily via `routes/console.php` |

## Quick Start

```bash
# Start containers
./vendor/bin/sail up -d

# Run migrations & seed
./vendor/bin/sail artisan migrate:fresh --seed

# Link storage
./vendor/bin/sail artisan storage:link

# Run tests (65 passing)
./vendor/bin/sail artisan test
```

**Test Users:**
- Admin: `admin@darkfantasy.com` / `password`
- Customer: `customer@darkfantasy.com` / `password`

**Emails:** Check `storage/logs/laravel.log` or http://localhost:8025 (Mailpit)

## Key Architectural Decisions

### 1. FIFO Inventory Management

Instead of simple stock tracking, implemented batch-based FIFO:

- **Why:** Realistic inventory accounting, audit trail, prevents spoilage
- **How:** `item_batches` table with `received_date` for ordering
- **Result:** When creating orders, stock automatically reserves from oldest batches first

```
Example: Order 75 units
Batch 1 (oldest): 50 units → Takes all 50
Batch 2 (next): 50 units → Takes 25
Creates 2 order_items tracking both batches
```

### 2. Database-Backed Carts

Carts stored in database, not session:

- **Tables:** `carts` (one per user) + `cart_items` (items with quantities)
- **Price Snapshots:** Captures `final_price` when item added (protects against price changes)
- **Validation:** Stock checked before checkout

### 3. Observer Pattern for Notifications

Low stock alerts triggered automatically:

- `ItemObserver` watches `available_stock` changes
- When stock ≤ `low_stock_threshold`, dispatches `SendLowStockNotification` job
- Queued for async processing

## Project Structure

```
app/
├── Models/              # Item, ItemBatch, Cart, Order (with relationships)
├── Services/            # OrderService (FIFO logic, order creation)
├── Jobs/                # SendLowStockNotification, SendDailySalesReport
├── Mail/                # Email templates
└── Observers/           # ItemObserver (triggers notifications)

database/
├── migrations/          # 6 tables: items, item_batches, carts, cart_items, orders, order_items
├── factories/           # ItemFactory, ItemBatchFactory
└── seeders/             # 22 dark fantasy books with 2-4 batches each

tests/Feature/
├── FIFOStockManagementTest.php     # 8 tests
├── CartManagementTest.php           # 15 tests
└── (Auth, Settings, etc.)           # 42 tests
```

## Features

### Inventory System
- Items with pricing, discounts, stock tracking
- Batch-based FIFO fulfillment
- Automatic stock updates
- Soft deletes for data retention

### Shopping Cart
- User-associated carts
- Add/update/remove items
- Price snapshots
- Total/count calculations

### Order Processing
- FIFO stock reservation
- Batch tracking per line item
- Order status lifecycle (pending/processing/completed/cancelled)
- Cancellation returns stock to batches

### Notifications
- **Low Stock:** Email when `available_stock ≤ low_stock_threshold`
- **Daily Report:** Sales summary sent at 8 PM (orders, revenue, top sellers)

### Sample Data
- 22 dark fantasy books with images
- Authors: Morgana Blackwood, Draven Nightshade, etc.
- Varied pricing ($15.99 - $89.99) with discounts (0-25%)
- Multiple batches per item (50-200 total units)

## Testing

```bash
# All tests (65 passing)
./vendor/bin/sail artisan test

# Specific suites
./vendor/bin/sail artisan test --filter=FIFO
./vendor/bin/sail artisan test --filter=Cart
```

**Test Coverage:**
- FIFO stock management (8 tests)
- Cart operations (15 tests)
- Authentication & 2FA (24 tests)
- User settings (18 tests)

## Demo Commands

```bash
# Simulate stock consumption (triggers low stock notification)
./vendor/bin/sail artisan simulate:stock-consumption

# Manual daily report
./vendor/bin/sail artisan tinker
>>> App\Jobs\SendDailySalesReport::dispatch();

# Queue worker (for notifications)
./vendor/bin/sail artisan queue:work

# Scheduler (for daily report cron)
./vendor/bin/sail artisan schedule:work
```

## Tech Stack

- Laravel 12, PHP 8.4
- React 19, Inertia.js v2
- Tailwind CSS 4
- Pest PHP 4
- MySQL 8.0
