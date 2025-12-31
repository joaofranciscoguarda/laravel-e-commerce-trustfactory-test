import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    DollarSign,
    Package,
    ShoppingBag,
    Users,
} from 'lucide-react';

interface DashboardProps {
    stats: {
        todayRevenue: number;
        todayOrders: number;
        todayItemsSold: number;
        totalCustomers: number;
    };
    lowStockItems: Array<{
        id: number;
        title: string;
        author: string;
        available_stock: number;
        low_stock_threshold: number;
        image_path: string;
    }>;
    recentOrders: Array<{
        id: number;
        order_number: string;
        customer_name: string;
        total: number;
        status: string;
        created_at: string;
    }>;
}

export default function Dashboard({
    stats,
    lowStockItems,
    recentOrders,
}: DashboardProps) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="border-b-2 border-foreground pb-4">
                    <h1 className="font-title text-4xl tracking-wider">
                        Dashboard
                    </h1>
                    <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                        Overview of today's performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Today's Revenue */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Today's Revenue
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    ${stats.todayRevenue.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Today's Orders */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Today's Orders
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    {stats.todayOrders}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items Sold Today */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Items Sold Today
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    {stats.todayItemsSold}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Customers */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Total Customers
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    {stats.totalCustomers}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Low Stock Alert */}
                    <div className="border-2 border-foreground bg-background">
                        <div className="border-b-2 border-foreground bg-muted p-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <h2 className="font-heading text-lg tracking-wider uppercase">
                                    Low Stock Alert
                                </h2>
                            </div>
                        </div>
                        <div className="p-4">
                            {lowStockItems.length > 0 ? (
                                <div className="space-y-4">
                                    {lowStockItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/admin/inventory/${item.id}`}
                                            className="flex items-center gap-4 border-2 border-transparent p-2 transition-colors hover:border-foreground hover:bg-muted"
                                        >
                                            <img
                                                src={`/thumbnails/${item.image_path}`}
                                                alt={item.title}
                                                className="h-16 w-12 border-2 border-foreground object-cover"
                                                style={{
                                                    imageRendering: 'pixelated',
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-heading text-sm tracking-wider">
                                                    {item.title}
                                                </h3>
                                                <p className="font-sans text-xs text-muted-foreground">
                                                    by {item.author}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span
                                                        className={`font-sans text-xs font-bold ${
                                                            item.available_stock ===
                                                            0
                                                                ? 'text-destructive'
                                                                : 'text-orange-500 dark:text-orange-400'
                                                        }`}
                                                    >
                                                        {item.available_stock}{' '}
                                                        left
                                                    </span>
                                                    <span className="font-sans text-xs text-muted-foreground">
                                                        (threshold:{' '}
                                                        {
                                                            item.low_stock_threshold
                                                        }
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/admin/inventory?stock_filter=low"
                                        className="block border-2 border-foreground bg-background px-4 py-2 text-center font-heading text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                    >
                                        View All Low Stock Items
                                    </Link>
                                </div>
                            ) : (
                                <p className="py-8 text-center font-sans text-sm text-muted-foreground">
                                    No low stock items at the moment.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="border-2 border-foreground bg-background">
                        <div className="border-b-2 border-foreground bg-muted p-4">
                            <h2 className="font-heading text-lg tracking-wider uppercase">
                                Recent Orders
                            </h2>
                        </div>
                        <div className="p-4">
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/admin/orders/${order.id}`}
                                            className="block border-2 border-transparent p-3 transition-colors hover:border-foreground hover:bg-muted"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-heading text-sm tracking-wider">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                        {order.created_at}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-title text-lg tracking-wider">
                                                        $
                                                        {order.total.toFixed(2)}
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-block border-2 px-2 py-1 font-sans text-xs uppercase ${
                                                            order.status ===
                                                            'completed'
                                                                ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                                                : order.status ===
                                                                    'processing'
                                                                  ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
                                                                  : order.status ===
                                                                      'cancelled'
                                                                    ? 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'
                                                                    : 'border-foreground'
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/admin/orders"
                                        className="block border-2 border-foreground bg-background px-4 py-2 text-center font-heading text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                    >
                                        View All Orders
                                    </Link>
                                </div>
                            ) : (
                                <p className="py-8 text-center font-sans text-sm text-muted-foreground">
                                    No orders yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
