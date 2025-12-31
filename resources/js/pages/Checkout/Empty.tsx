import ShopLayout from '@/layouts/shop-layout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

export default function Empty() {
    return (
        <ShopLayout>
            <Head title="Checkout - Dark Fantasy Library" />

            <div className="container mx-auto px-4 py-8">
                <div className="border-2 border-foreground py-16 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p className="mb-2 font-heading text-xl">
                        Your cart is empty
                    </p>
                    <p className="mb-6 font-sans text-sm text-muted-foreground">
                        Add some items to your cart before checking out
                    </p>
                    <Link
                        href="/"
                        className="inline-block border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                    >
                        Browse Books
                    </Link>
                </div>
            </div>
        </ShopLayout>
    );
}
