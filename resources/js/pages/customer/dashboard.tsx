import DashboardLayout from '@/layouts/customer/dashboard-layout';
import { Link } from '@inertiajs/react';
import { Package, ShoppingBag, DollarSign } from 'lucide-react';

interface DashboardProps {
    stats: {
        totalOrders: number;
        totalSpent: number;
        pendingOrders: number;
    };
    recentOrders: Array<{
        id: number;
        order_number: string;
        total: number;
        status: string;
        created_at: string;
    }>;
}

export default function Dashboard({ stats, recentOrders }: DashboardProps) {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="border-b-2 border-foreground pb-4">
                    <h1 className="font-title text-4xl tracking-wider">
                        My Account
                    </h1>
                    <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                        Welcome back to your account
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Total Orders */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Total Orders
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    {stats.totalOrders}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Total Spent
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    ${stats.totalSpent.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="border-2 border-foreground bg-background p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded border-2 border-foreground p-3">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                                    Pending Orders
                                </p>
                                <p className="mt-1 font-title text-2xl tracking-wider">
                                    {stats.pendingOrders}
                                </p>
                            </div>
                        </div>
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
                                        href={`/orders/${order.id}`}
                                        className="block border-2 border-transparent p-3 transition-colors hover:border-foreground hover:bg-muted"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-heading text-sm tracking-wider">
                                                    {order.order_number}
                                                </p>
                                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                    {order.created_at}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-title text-lg tracking-wider">
                                                    ${order.total.toFixed(2)}
                                                </p>
                                                <span
                                                    className={`mt-1 inline-block border-2 px-2 py-1 font-sans text-xs uppercase ${
                                                        order.status === 'completed'
                                                            ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                                            : order.status === 'processing'
                                                              ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
                                                              : order.status === 'cancelled'
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
                                    href="/orders"
                                    className="block border-2 border-foreground bg-background px-4 py-2 text-center font-heading text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    View All Orders
                                </Link>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 font-heading text-sm tracking-wider uppercase text-muted-foreground">
                                    No orders yet
                                </p>
                                <p className="mt-2 font-sans text-sm text-muted-foreground">
                                    Start shopping to see your orders here
                                </p>
                                <Link
                                    href="/"
                                    className="mt-6 inline-block border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-opacity hover:opacity-80"
                                >
                                    Browse Books
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/settings/profile"
                        className="block border-2 border-foreground bg-background p-6 transition-colors hover:bg-muted"
                    >
                        <h3 className="font-heading text-lg tracking-wider uppercase">
                            Profile Settings
                        </h3>
                        <p className="mt-2 font-sans text-sm text-muted-foreground">
                            Update your name, email, and account information
                        </p>
                    </Link>
                    <Link
                        href="/settings/password"
                        className="block border-2 border-foreground bg-background p-6 transition-colors hover:bg-muted"
                    >
                        <h3 className="font-heading text-lg tracking-wider uppercase">
                            Security
                        </h3>
                        <p className="mt-2 font-sans text-sm text-muted-foreground">
                            Change your password and enable two-factor authentication
                        </p>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
