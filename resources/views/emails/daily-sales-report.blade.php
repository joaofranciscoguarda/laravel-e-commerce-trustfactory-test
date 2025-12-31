<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card .label {
            font-size: 12px;
            text-transform: uppercase;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .summary-card .value {
            font-size: 28px;
            font-weight: bold;
        }
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .orders-table th {
            background-color: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        .orders-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        .orders-table tr:hover {
            background-color: #f8f9fa;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-pending {
            background-color: #ffc107;
            color: #000;
        }
        .status-processing {
            background-color: #17a2b8;
            color: white;
        }
        .status-completed {
            background-color: #28a745;
            color: white;
        }
        .status-cancelled {
            background-color: #dc3545;
            color: white;
        }
        .no-orders {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .no-orders-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .summary-cards {
                grid-template-columns: 1fr;
            }
            .orders-table {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Sales Report</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">{{ $date }}</p>
        </div>

        <div class="summary-cards">
            <div class="summary-card">
                <div class="label">Total Orders</div>
                <div class="value">{{ $orderCount }}</div>
            </div>
            <div class="summary-card">
                <div class="label">Items Sold</div>
                <div class="value">{{ $totalItemsSold }}</div>
            </div>
            <div class="summary-card">
                <div class="label">Revenue</div>
                <div class="value">${{ number_format($totalRevenue, 2) }}</div>
            </div>
        </div>

        @if($orders->count() > 0)
            <h2 style="color: #667eea; margin-top: 30px;">Today's Orders</h2>

            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                    <tr>
                        <td><strong>{{ $order->order_number }}</strong></td>
                        <td>{{ $order->user->name }}</td>
                        <td>{{ $order->items->sum('quantity') }}</td>
                        <td><strong>${{ number_format($order->total, 2) }}</strong></td>
                        <td>
                            <span class="status-badge status-{{ $order->status }}">
                                {{ ucfirst($order->status) }}
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <h3 style="color: #667eea;">Top Selling Items Today</h3>
            <ul style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
                @php
                    $topItems = $orders->flatMap(function($order) {
                        return $order->items;
                    })->groupBy('item_id')->map(function($items) {
                        return [
                            'title' => $items->first()->item->title,
                            'quantity' => $items->sum('quantity'),
                            'revenue' => $items->sum('subtotal')
                        ];
                    })->sortByDesc('quantity')->take(5);
                @endphp

                @foreach($topItems as $topItem)
                <li>
                    <strong>{{ $topItem['title'] }}</strong> -
                    {{ $topItem['quantity'] }} units sold
                    (${{ number_format($topItem['revenue'], 2) }})
                </li>
                @endforeach
            </ul>
        @else
            <div class="no-orders">
                <div class="no-orders-icon">📭</div>
                <h3>No Orders Today</h3>
                <p>There were no orders placed on {{ $date }}.</p>
            </div>
        @endif

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 30px;">
            <p style="margin: 0;">
                <strong>💡 Tip:</strong>
                @if($totalRevenue > 0)
                    Great job! Today's revenue was ${{ number_format($totalRevenue, 2) }}.
                    Keep monitoring stock levels to ensure popular items remain available.
                @else
                    Consider running a promotion or checking your marketing efforts to boost sales.
                @endif
            </p>
        </div>

        <div class="footer">
            <p>This is an automated daily sales report from Dark Fantasy Bookstore E-Commerce System</p>
            <p>&copy; {{ date('Y') }} Dark Fantasy Bookstore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
