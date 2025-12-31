import ShopLayout from '@/layouts/shop-layout';
import { Cart, CartItem } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';

interface Props {
    cart: Cart | null;
    items: CartItem[];
    total: number;
    count: number;
}

export default function Index({ cart, items, total, count }: Props) {
    const { post, processing } = useForm({});

    const handleCheckout = () => {
        post('/checkout');
    };

    if (items.length === 0) {
        return (
            <ShopLayout>
                <Head title="Checkout - Dark Fantasy Library" />

                <div className="container mx-auto px-4 py-8">
                    <div className="border-2 border-foreground py-16 text-center">
                        <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
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

    return (
        <ShopLayout>
            <Head title="Checkout - Dark Fantasy Library" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 font-title text-3xl tracking-wider md:text-5xl">
                    Checkout
                </h1>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 font-heading text-xl uppercase">
                            Order Summary
                        </h2>
                        <div className="space-y-4">
                            {items.map((cartItem) => (
                                <div
                                    key={cartItem.id}
                                    className="border-2 border-foreground bg-background p-4"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="h-24 w-16 flex-shrink-0 overflow-hidden border-2 border-foreground md:h-28 md:w-20">
                                            <img
                                                src={`/thumbnails/${cartItem.item.image_path}`}
                                                alt={cartItem.item.title}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="mb-1 line-clamp-2 font-title text-base md:text-lg">
                                                {cartItem.item.title}
                                            </h3>
                                            <p className="mb-2 font-sans text-sm text-muted-foreground">
                                                {cartItem.item.author}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-sans text-sm text-muted-foreground">
                                                    Qty: {cartItem.quantity}
                                                </p>
                                                <p className="font-heading text-base md:text-lg">
                                                    $
                                                    {(
                                                        cartItem.quantity *
                                                        cartItem.price_snapshot
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 border-2 border-foreground bg-background p-6">
                            <h2 className="mb-4 font-heading text-xl uppercase">
                                Order Total
                            </h2>

                            <div className="mb-6 space-y-3 border-b-2 border-foreground pb-6">
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-muted-foreground">
                                        Items ({count})
                                    </span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-muted-foreground">
                                        Tax
                                    </span>
                                    <span>Included</span>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-between font-heading text-2xl">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={processing}
                                className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        Complete Order
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <Link
                                href="/cart"
                                className="block w-full text-center font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
