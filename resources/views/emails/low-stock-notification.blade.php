<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
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
        .alert {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .item-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .item-details h3 {
            margin-top: 0;
            color: #667eea;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #333;
        }
        .stock-warning {
            color: #dc3545;
            font-weight: bold;
            font-size: 18px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Low Stock Alert</h1>
        </div>

        <div class="alert">
            <strong>Action Required!</strong> One of your items is running low on stock.
        </div>

        <div class="item-details">
            <h3>{{ $item->title }}</h3>

            <div class="detail-row">
                <span class="detail-label">Author:</span>
                <span class="detail-value">{{ $item->author }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Current Stock:</span>
                <span class="detail-value stock-warning">{{ $availableStock }} units</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Low Stock Threshold:</span>
                <span class="detail-value">{{ $threshold }} units</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Base Price:</span>
                <span class="detail-value">${{ number_format($item->base_price, 2) }}</span>
            </div>

            @if($item->discount_percentage > 0)
            <div class="detail-row">
                <span class="detail-label">Current Discount:</span>
                <span class="detail-value">{{ $item->discount_percentage }}%</span>
            </div>
            @endif
        </div>

        <p>
            <strong>Recommendation:</strong> Please restock this item soon to avoid running out of inventory.
            Consider ordering at least {{ $threshold * 2 }} units to maintain adequate stock levels.
        </p>

        <div class="footer">
            <p>This is an automated notification from Dark Fantasy Bookstore E-Commerce System</p>
            <p>&copy; {{ date('Y') }} Dark Fantasy Bookstore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
