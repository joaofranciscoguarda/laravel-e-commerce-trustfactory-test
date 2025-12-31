import { AddToCartButton } from '@/components/shop/add-to-cart-button';
import ShopLayout from '@/layouts/shop-layout';
import { Item, PaginatedData } from '@/types/models';
import { Head, Link } from '@inertiajs/react';

interface Props {
    items: PaginatedData<Item>;
    cartQuantities: Record<number, number>;
}

export default function Index({ items, cartQuantities }: Props) {
    return (
        <ShopLayout>
            <Head title="Shop - Dark Fantasy Library" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 font-title text-4xl tracking-wider md:text-6xl">
                        Dark Fantasy Bookstore
                    </h1>
                    <p className="font-sans text-sm text-muted-foreground md:text-base">
                        Discover forbidden knowledge and occult secrets
                    </p>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    {items.data.map((item) => (
                        <Link
                            key={item.id}
                            href={`/shop/${item.id}`}
                            className="group border-2 border-foreground transition-colors hover:bg-muted"
                        >
                            {/* Book Cover */}
                            <div className="aspect-[2/3] overflow-hidden border-b-2 border-foreground bg-muted">
                                <img
                                    src={`/thumbnails/${item.image_path}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Book Info */}
                            <div className="p-3 md:p-4">
                                <h3 className="mb-1 line-clamp-2 font-title text-base group-hover:opacity-80 md:text-lg">
                                    {item.title}
                                </h3>
                                <p className="mb-2 font-sans text-xs text-muted-foreground md:text-sm">
                                    {item.author}
                                </p>
                                {item.discount_percentage > 0 ? (
                                    <div className="mb-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-heading text-sm md:text-base">
                                                ${item.final_price}
                                            </span>
                                            <span className="font-sans text-xs text-muted-foreground line-through">
                                                ${item.base_price}
                                            </span>
                                        </div>
                                        <span className="inline-block bg-foreground px-2 py-0.5 font-sans text-xs text-background">
                                            -{item.discount_percentage}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mb-2">
                                        <span className="font-heading text-sm md:text-base">
                                            ${item.final_price}
                                        </span>
                                    </div>
                                )}

                                <AddToCartButton
                                    item={item}
                                    initialQuantity={
                                        cartQuantities[item.id] || 0
                                    }
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {items.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`border-2 border-foreground px-4 py-2 font-sans text-sm ${
                                    link.active
                                        ? 'bg-foreground text-background'
                                        : 'bg-background hover:bg-muted'
                                } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {items.data.length === 0 && (
                    <div className="border-2 border-foreground py-16 text-center">
                        <p className="mb-2 font-heading text-xl">
                            No books found
                        </p>
                        <p className="font-sans text-sm text-muted-foreground">
                            Check back soon for new arrivals
                        </p>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
