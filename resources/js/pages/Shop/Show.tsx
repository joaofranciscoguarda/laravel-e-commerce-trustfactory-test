import ShopLayout from '@/layouts/shop-layout';
import { Item } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Package, ShoppingCart } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    item: Item;
}

export default function Show({ item }: Props) {
    const { data, setData, post, processing } = useForm({
        item_id: item.id,
        quantity: 1,
    });

    const isLowStock = item.available_stock <= item.low_stock_threshold;
    const isOutOfStock = item.available_stock === 0;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/cart/add');
    };

    return (
        <ShopLayout>
            <Head title={`${item.title} - Dark Fantasy Bookstore`} />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                >
                    ← Back to Shop
                </Link>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Book Image */}
                    <div className="border-2 border-foreground">
                        <img
                            src={`/storage/${item.image_path}`}
                            alt={item.title}
                            className="h-auto w-full"
                        />
                    </div>

                    {/* Book Details */}
                    <div>
                        <h1 className="mb-2 font-title text-3xl tracking-wider md:text-5xl">
                            {item.title}
                        </h1>
                        <p className="mb-4 font-heading text-lg text-muted-foreground md:text-xl">
                            by {item.author}
                        </p>

                        {/* Price */}
                        <div className="mb-6 border-b-2 border-foreground pb-6">
                            {item.discount_percentage > 0 ? (
                                <div className="flex items-center gap-4">
                                    <span className="font-heading text-3xl">
                                        ${item.final_price}
                                    </span>
                                    <span className="font-sans text-xl text-muted-foreground line-through">
                                        ${item.base_price}
                                    </span>
                                    <span className="bg-foreground px-3 py-1 font-sans text-sm text-background">
                                        SAVE {item.discount_percentage}%
                                    </span>
                                </div>
                            ) : (
                                <span className="font-heading text-3xl">
                                    ${item.final_price}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            <div className="mb-2 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                <span className="font-heading text-sm uppercase">
                                    Stock Status
                                </span>
                            </div>
                            {isOutOfStock ? (
                                <div className="border-2 border-destructive bg-destructive/10 p-3">
                                    <p className="font-sans text-sm text-destructive">
                                        Out of Stock
                                    </p>
                                </div>
                            ) : isLowStock ? (
                                <div className="flex items-start gap-2 border-2 border-foreground bg-muted p-3">
                                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <p className="font-sans text-sm">
                                        Only {item.available_stock} left in
                                        stock - Order soon!
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-foreground p-3">
                                    <p className="font-sans text-sm">
                                        In Stock ({item.available_stock}{' '}
                                        available)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Form */}
                        {!isOutOfStock && (
                            <form
                                onSubmit={handleSubmit}
                                className="mb-6 space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className="mb-2 block font-heading text-sm uppercase"
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={item.available_stock}
                                        value={data.quantity}
                                        onChange={(e) =>
                                            setData(
                                                'quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-24 border-2 border-foreground bg-background px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {processing ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </form>
                        )}

                        {/* Description */}
                        <div className="border-t-2 border-foreground pt-6">
                            <h2 className="mb-3 font-heading text-lg uppercase">
                                Description
                            </h2>
                            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
