import AdminLayout from '@/layouts/admin-layout';
import ShopLayout from '@/layouts/shop-layout';
import { Auth } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';

interface DashboardProps {
    children: React.ReactNode;
    auth: Auth;
}

export default function Dashboard({ auth }: DashboardProps) {
    const isAdmin = auth.user.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout>
                <Head title="Admin Dashboard" />

                <div>
                    <h1 className="mb-2 font-title text-4xl tracking-wider">
                        Admin Dashboard
                    </h1>
                    <p className="mb-8 font-sans text-sm text-muted-foreground">
                        Welcome back, {auth.user.name}
                    </p>

                    {/* Stats Grid */}
                    <div className="mb-8 grid gap-6 md:grid-cols-3">
                        <div className="border-2 border-foreground p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <Package className="h-8 w-8 opacity-70" />
                                <span className="font-heading text-3xl">
                                    22
                                </span>
                            </div>
                            <p className="font-heading text-sm text-muted-foreground uppercase">
                                Total Items
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <ShoppingBag className="h-8 w-8 opacity-70" />
                                <span className="font-heading text-3xl">0</span>
                            </div>
                            <p className="font-heading text-sm text-muted-foreground uppercase">
                                Orders Today
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <TrendingUp className="h-8 w-8 opacity-70" />
                                <span className="font-heading text-3xl">
                                    $0
                                </span>
                            </div>
                            <p className="font-heading text-sm text-muted-foreground uppercase">
                                Revenue Today
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-2 border-foreground p-6">
                        <h2 className="mb-4 font-heading text-xl uppercase">
                            Quick Actions
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Link
                                href="/dashboard/inventory"
                                className="border-2 border-foreground p-4 transition-colors hover:bg-muted"
                            >
                                <p className="font-heading text-sm uppercase">
                                    Manage Inventory
                                </p>
                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                    View and update stock levels
                                </p>
                            </Link>
                            <Link
                                href="/dashboard/orders"
                                className="border-2 border-foreground p-4 transition-colors hover:bg-muted"
                            >
                                <p className="font-heading text-sm uppercase">
                                    View Orders
                                </p>
                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                    Process and manage orders
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Customer Dashboard
    return (
        <ShopLayout>
            <Head title="My Account" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-2 font-title text-3xl tracking-wider md:text-5xl">
                    My Account
                </h1>
                <p className="mb-8 font-sans text-sm text-muted-foreground">
                    Welcome back, {auth.user.name}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    <Link
                        href="/orders"
                        className="border-2 border-foreground p-6 transition-colors hover:bg-muted"
                    >
                        <ShoppingBag className="mb-3 h-8 w-8 opacity-70" />
                        <h2 className="mb-2 font-heading text-xl uppercase">
                            My Orders
                        </h2>
                        <p className="font-sans text-sm text-muted-foreground">
                            View your order history and track deliveries
                        </p>
                    </Link>

                    <Link
                        href="/settings"
                        className="border-2 border-foreground p-6 transition-colors hover:bg-muted"
                    >
                        <Package className="mb-3 h-8 w-8 opacity-70" />
                        <h2 className="mb-2 font-heading text-xl uppercase">
                            Account Settings
                        </h2>
                        <p className="font-sans text-sm text-muted-foreground">
                            Manage your profile and preferences
                        </p>
                    </Link>
                </div>
            </div>
        </ShopLayout>
    );
}
