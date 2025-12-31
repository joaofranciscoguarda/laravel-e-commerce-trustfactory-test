import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { ReactNode } from 'react';

interface ShopLayoutProps {
    children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
    const { cartCount = 0 } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Desktop Navigation */}
            <header className="hidden border-b-2 border-foreground bg-background md:block">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="font-heading text-3xl tracking-wider transition-opacity hover:opacity-80"
                        >
                            Dark Fantasy
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="flex items-center gap-6">
                            <Link
                                href="/shop/search"
                                className="font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                            >
                                Search
                            </Link>
                            <Link
                                href="/orders"
                                className="font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/cart"
                                className="relative flex items-center gap-2 font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-foreground font-sans text-xs text-background">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/dashboard"
                                className="font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background md:hidden">
                <div className="px-4 py-3">
                    <Link
                        href="/"
                        className="block text-center font-title text-2xl tracking-wider"
                    >
                        Dark Fantasy
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-20 md:pb-8">{children}</main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-foreground bg-background md:hidden">
                <div className="grid h-16 grid-cols-4">
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted"
                    >
                        <Home className="h-5 w-5" />
                        <span className="font-sans text-xs uppercase">
                            Home
                        </span>
                    </Link>
                    <Link
                        href="/shop/search"
                        className="flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted"
                    >
                        <Search className="h-5 w-5" />
                        <span className="font-sans text-xs uppercase">
                            Search
                        </span>
                    </Link>
                    <Link
                        href="/cart"
                        className="relative flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-sans text-xs uppercase">
                            Cart
                        </span>
                        {cartCount > 0 && (
                            <span className="absolute top-2 right-1/4 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-foreground font-sans text-xs text-background">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted"
                    >
                        <User className="h-5 w-5" />
                        <span className="font-sans text-xs uppercase">Me</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
