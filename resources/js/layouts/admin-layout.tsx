import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Package, ShoppingBag } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href="/admin"
                            className="font-title text-3xl tracking-wider transition-opacity hover:opacity-80"
                        >
                            Dark Fantasy
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="font-heading text-sm tracking-wider uppercase">
                                Admin: {auth.user.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-2 border-2 border-foreground px-4 py-2 font-sans text-sm tracking-wider uppercase transition-opacity hover:bg-foreground hover:text-background hover:opacity-80"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar Navigation */}
                <aside className="sticky top-16 min-h-[calc(100vh-4rem)] w-64 border-r-2 border-foreground bg-background">
                    <nav className="space-y-2 p-4">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 border-2 border-transparent px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/inventory"
                            className="flex items-center gap-3 border-2 border-transparent px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                        >
                            <Package className="h-5 w-5" />
                            Inventory
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 border-2 border-transparent px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Orders
                        </Link>

                        <div className="mt-4 border-t-2 border-foreground pt-4">
                            <Link
                                href="/"
                                className="flex items-center gap-3 border-2 border-transparent px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                            >
                                View Shop
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
