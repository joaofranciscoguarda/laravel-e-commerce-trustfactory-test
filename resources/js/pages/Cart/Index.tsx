import ShopLayout from '@/layouts/shop-layout';
import { Cart, CartItem } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

interface Props {
    cart: Cart | null;
    items: CartItem[];
    total: number;
    count: number;
}

export default function Index({ cart, items, total, count }: Props) {
    const updateQuantity = (itemId: number, newQuantity: number) => {
        router.put(
            `/cart/${itemId}`,
            { quantity: newQuantity },
            { preserveScroll: true },
        );
    };

    const removeItem = (itemId: number) => {
        if (confirm('Remove this item from cart?')) {
            router.delete(`/cart/${itemId}`, { preserveScroll: true });
        }
    };

    const clearCart = () => {
        if (confirm('Clear all items from cart?')) {
            router.delete('/cart');
        }
    };

    const getSubtotal = (item: CartItem) => {
        return (item.quantity * item.price_snapshot).toFixed(2);
    };

    return (
        <ShopLayout>
            <Head title="Shopping Cart - Dark Fantasy Bookstore" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="font-title text-3xl tracking-wider md:text-5xl">
                        Shopping Cart
                    </h1>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="border-2 border-foreground py-16 text-center">
                        <ShoppingBag className="mx-auto mb-4 h-16 w-16 opacity-50" />
                        <p className="mb-2 font-heading text-xl">
                            Your cart is empty
                        </p>
                        <p className="mb-6 font-sans text-sm text-muted-foreground">
                            Start adding some dark fantasy books to your
                            collection
                        </p>
                        <Link
                            href="/"
                            className="inline-block border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                        >
                            Browse Books
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            {items.map((cartItem) => (
                                <div
                                    key={cartItem.id}
                                    className="border-2 border-foreground bg-background p-4"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <Link
                                            href={`/shop/${cartItem.item.id}`}
                                            className="h-28 w-20 flex-shrink-0 overflow-hidden border-2 border-foreground md:h-32 md:w-24"
                                        >
                                            <img
                                                src={`/storage/${cartItem.item.image_path}`}
                                                alt={cartItem.item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/shop/${cartItem.item.id}`}
                                                className="mb-1 line-clamp-2 block font-title text-lg hover:opacity-80 md:text-xl"
                                            >
                                                {cartItem.item.title}
                                            </Link>
                                            <p className="mb-3 font-sans text-sm text-muted-foreground">
                                                {cartItem.item.author}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                cartItem.item
                                                                    .id,
                                                                Math.max(
                                                                    1,
                                                                    cartItem.quantity -
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        disabled={
                                                            cartItem.quantity <=
                                                            1
                                                        }
                                                        className="border-2 border-foreground p-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-sans text-sm">
                                                        {cartItem.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                cartItem.item
                                                                    .id,
                                                                Math.min(
                                                                    cartItem
                                                                        .item
                                                                        .available_stock,
                                                                    cartItem.quantity +
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        disabled={
                                                            cartItem.quantity >=
                                                            cartItem.item
                                                                .available_stock
                                                        }
                                                        className="border-2 border-foreground p-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Price and Remove */}
                                                <div className="flex items-center gap-4">
                                                    <span className="font-heading text-base md:text-lg">
                                                        ${getSubtotal(cartItem)}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            removeItem(
                                                                cartItem.item
                                                                    .id,
                                                            )
                                                        }
                                                        className="text-muted-foreground transition-colors hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stock Warning */}
                                            {cartItem.quantity >=
                                                cartItem.item
                                                    .available_stock && (
                                                <p className="mt-2 font-sans text-xs text-muted-foreground">
                                                    Maximum quantity available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 border-2 border-foreground bg-background p-6">
                                <h2 className="mb-4 font-heading text-xl uppercase">
                                    Order Summary
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
                                </div>

                                <div className="mb-6 flex justify-between font-heading text-xl">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full border-2 border-foreground bg-foreground px-6 py-3 text-center font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/"
                                    className="mt-3 block w-full text-center font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
