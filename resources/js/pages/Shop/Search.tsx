import { AddToCartButton } from '@/components/shop/add-to-cart-button';
import ShopLayout from '@/layouts/shop-layout';
import { Item, PaginatedData } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Search as SearchIcon, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props {
    items: PaginatedData<Item>;
    query: string;
    cartQuantities: Record<number, number>;
}

export default function Search({ items, query, cartQuantities }: Props) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/shop/search', { q: searchQuery }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get('/shop/search', {}, { preserveState: true });
    };

    return (
        <ShopLayout>
            <Head title="Search - Dark Fantasy Bookstore" />

            <div className="container mx-auto px-4 py-8">
                {/* Search Form */}
                <div className="mb-8">
                    <h1 className="mb-4 font-title text-3xl tracking-wider md:text-5xl">
                        Search Books
                    </h1>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search by title, author, or description..."
                                    className="w-full border-2 border-foreground bg-background px-4 py-3 pr-10 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 hover:opacity-70"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                            >
                                <SearchIcon className="h-5 w-5" />
                                <span className="hidden md:inline">Search</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Count */}
                {query && (
                    <div className="mb-4">
                        <p className="font-sans text-sm text-muted-foreground">
                            {items.data.length > 0
                                ? `Found ${items.data.length} result${items.data.length !== 1 ? 's' : ''} for "${query}"`
                                : `No results found for "${query}"`}
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {items.data.length > 0 ? (
                    <>
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
                                                    -{item.discount_percentage}%
                                                    OFF
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
                    </>
                ) : query ? (
                    <div className="border-2 border-foreground py-16 text-center">
                        <SearchIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p className="mb-2 font-heading text-xl">
                            No books found
                        </p>
                        <p className="mb-4 font-sans text-sm text-muted-foreground">
                            Try different keywords or browse all books
                        </p>
                        <Link
                            href="/"
                            className="inline-block border-2 border-foreground px-6 py-2 font-heading text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                        >
                            Browse All Books
                        </Link>
                    </div>
                ) : (
                    <div className="border-2 border-foreground py-16 text-center">
                        <SearchIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p className="mb-2 font-heading text-xl">
                            Start Searching
                        </p>
                        <p className="font-sans text-sm text-muted-foreground">
                            Enter a search term to find dark fantasy books
                        </p>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
