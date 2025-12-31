import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Lock,
    LogOut,
    Moon,
    Package,
    Search,
    ShieldCheck,
    ShoppingCart,
    User,
} from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { auth, cartCount = 0 } = usePage<SharedData>().props;
    const currentPath = window.location.pathname;

    const isActive = (path: string) => currentPath === path;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Desktop Navigation */}
            <header className="hidden border-b-2 border-foreground bg-background md:block">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href="/"
                            className="font-title text-3xl tracking-wider transition-opacity hover:opacity-80"
                        >
                            Dark Fantasy
                        </Link>

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
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-2 border-2 border-foreground px-4 py-2 font-sans text-sm tracking-wider uppercase transition-opacity hover:bg-foreground hover:text-background hover:opacity-80"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
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

            <div className="flex">
                {/* Sidebar Navigation - Desktop */}
                <aside className="sticky top-16 hidden min-h-[calc(100vh-4rem)] w-64 border-r-2 border-foreground bg-background md:block">
                    <nav className="space-y-2 p-4">
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                isActive('/dashboard')
                                    ? 'border-foreground bg-muted'
                                    : 'border-transparent hover:border-foreground hover:bg-muted'
                            }`}
                        >
                            <User className="h-5 w-5" />
                            Account
                        </Link>
                        <Link
                            href="/orders"
                            className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                isActive('/orders')
                                    ? 'border-foreground bg-muted'
                                    : 'border-transparent hover:border-foreground hover:bg-muted'
                            }`}
                        >
                            <Package className="h-5 w-5" />
                            Orders
                        </Link>

                        <div className="border-t-2 border-foreground pt-4">
                            <p className="mb-2 px-4 font-heading text-xs tracking-wider uppercase text-muted-foreground">
                                Settings
                            </p>
                            <Link
                                href="/settings/profile"
                                className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                    isActive('/settings/profile')
                                        ? 'border-foreground bg-muted'
                                        : 'border-transparent hover:border-foreground hover:bg-muted'
                                }`}
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Link>
                            <Link
                                href="/settings/password"
                                className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                    isActive('/settings/password')
                                        ? 'border-foreground bg-muted'
                                        : 'border-transparent hover:border-foreground hover:bg-muted'
                                }`}
                            >
                                <Lock className="h-4 w-4" />
                                Password
                            </Link>
                            <Link
                                href="/settings/appearance"
                                className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                    isActive('/settings/appearance')
                                        ? 'border-foreground bg-muted'
                                        : 'border-transparent hover:border-foreground hover:bg-muted'
                                }`}
                            >
                                <Moon className="h-4 w-4" />
                                Appearance
                            </Link>
                            <Link
                                href="/settings/two-factor"
                                className={`flex items-center gap-3 border-2 px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors ${
                                    isActive('/settings/two-factor')
                                        ? 'border-foreground bg-muted'
                                        : 'border-transparent hover:border-foreground hover:bg-muted'
                                }`}
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Two-Factor
                            </Link>
                        </div>

                        <div className="border-t-2 border-foreground pt-4">
                            <Link
                                href="/"
                                className="flex items-center gap-3 border-2 border-transparent px-4 py-3 font-heading text-sm tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                            >
                                Back to Shop
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-foreground bg-background md:hidden">
                <div className="grid h-16 grid-cols-4">
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted"
                    >
                        <Home className="h-5 w-5" />
                        <span className="font-sans text-xs uppercase">Home</span>
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
                        <span className="font-sans text-xs uppercase">Cart</span>
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
