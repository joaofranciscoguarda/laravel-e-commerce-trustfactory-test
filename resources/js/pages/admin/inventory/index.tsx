import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Item {
    id: number;
    title: string;
    author: string;
    image_path: string;
    base_price: number;
    discount_percentage: number;
    final_price: number;
    total_stock: number;
    available_stock: number;
    low_stock_threshold: number;
    is_active: boolean;
    is_low_stock: boolean;
    batch_count: number;
}

interface PaginatedItems {
    data: Item[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    stock_filter?: string;
    sort_by: string;
    sort_direction: string;
}

interface InventoryIndexProps {
    items: PaginatedItems;
    filters: Filters;
}

export default function InventoryIndex({
    items,
    filters,
}: InventoryIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [stockFilter, setStockFilter] = useState(filters.stock_filter || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/inventory',
            { search, stock_filter: stockFilter },
            { preserveState: true },
        );
    };

    const handleSort = (sortBy: string) => {
        const newDirection =
            filters.sort_by === sortBy && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/admin/inventory',
            {
                ...filters,
                sort_by: sortBy,
                sort_direction: newDirection,
            },
            { preserveState: true },
        );
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort_by !== column) return null;
        return filters.sort_direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="border-b-2 border-foreground pb-4">
                    <h1 className="font-title text-4xl tracking-wider">
                        Inventory Management
                    </h1>
                    <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                        {items.total} items total
                    </p>
                </div>

                {/* Search and Filters */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 border-2 border-foreground bg-muted p-4 md:flex-row"
                >
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title or author..."
                                className="w-full border-2 border-foreground bg-background px-4 py-2 pr-10 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                            />
                            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock_filter" className="sr-only">
                            Stock Status
                        </label>
                        <select
                            id="stock_filter"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="w-full border-2 border-foreground bg-background px-4 py-2 font-heading text-sm tracking-wider uppercase focus:ring-2 focus:ring-foreground focus:outline-none md:w-auto"
                        >
                            <option value="">All Items</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                            <option value="in_stock">In Stock</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="border-2 border-foreground bg-foreground px-6 py-2 font-heading text-sm tracking-wider text-background uppercase transition-opacity hover:opacity-80"
                    >
                        Search
                    </button>
                </form>

                {/* Items Table */}
                <div className="overflow-x-auto border-2 border-foreground">
                    <table className="w-full bg-background">
                        <thead className="border-b-2 border-foreground bg-muted">
                            <tr>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('title')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Item
                                        <SortIcon column="title" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('stock')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Stock
                                        <SortIcon column="stock" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Price
                                        <SortIcon column="price" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-center font-heading text-xs tracking-wider uppercase">
                                    Status
                                </th>
                                {/*<th className="p-4 text-center font-heading text-xs tracking-wider uppercase">
                                    Actions
                                </th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b-2 border-foreground transition-colors last:border-b-0 hover:bg-muted"
                                >
                                    <td className="border-r-2 border-foreground p-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`/thumbnails/${item.image_path}`}
                                                alt={item.title}
                                                className="h-20 w-14 border-2 border-foreground object-cover"
                                                style={{
                                                    imageRendering: 'pixelated',
                                                }}
                                            />
                                            <div>
                                                <h3 className="font-heading text-sm tracking-wider">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                    by {item.author}
                                                </p>
                                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                    {item.batch_count}{' '}
                                                    {item.batch_count === 1
                                                        ? 'batch'
                                                        : 'batches'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4">
                                        <div className="flex items-center gap-2">
                                            {item.is_low_stock && (
                                                <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                            )}
                                            <div>
                                                <p
                                                    className={`font-sans text-sm font-bold ${
                                                        item.available_stock ===
                                                        0
                                                            ? 'text-destructive'
                                                            : item.is_low_stock
                                                              ? 'text-orange-500 dark:text-orange-400'
                                                              : ''
                                                    }`}
                                                >
                                                    {item.available_stock} /{' '}
                                                    {item.total_stock}
                                                </p>
                                                <p className="font-sans text-xs text-muted-foreground">
                                                    Threshold:{' '}
                                                    {item.low_stock_threshold}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4">
                                        <div>
                                            <p className="font-title text-sm tracking-wider">
                                                ${item.final_price.toFixed(2)}
                                            </p>
                                            {item.discount_percentage > 0 && (
                                                <div className="mt-1 flex items-center gap-2">
                                                    <p className="font-sans text-xs text-muted-foreground line-through">
                                                        $
                                                        {item.base_price.toFixed(
                                                            2,
                                                        )}
                                                    </p>
                                                    <span className="border border-foreground px-1 font-sans text-xs">
                                                        -
                                                        {
                                                            item.discount_percentage
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4 text-center">
                                        <span
                                            className={`inline-block border-2 px-2 py-1 font-sans text-xs uppercase ${
                                                item.is_active
                                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'
                                            }`}
                                        >
                                            {item.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    {/*<td className="p-4 text-center">
                                        <Link
                                            href={`/admin/inventory/${item.id}`}
                                            className="inline-block border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                        >
                                            View Details
                                        </Link>
                                    </td>*/}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="flex items-center justify-between border-2 border-foreground bg-muted p-4">
                        <p className="font-sans text-sm text-muted-foreground">
                            Page {items.current_page} of {items.last_page}
                        </p>
                        <div className="flex gap-2">
                            {items.current_page > 1 && (
                                <Link
                                    href={`/admin/inventory?page=${items.current_page - 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Previous
                                </Link>
                            )}
                            {items.current_page < items.last_page && (
                                <Link
                                    href={`/admin/inventory?page=${items.current_page + 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {items.data.length === 0 && (
                    <div className="border-2 border-foreground bg-background p-12 text-center">
                        <p className="font-heading text-sm tracking-wider text-muted-foreground uppercase">
                            No items found
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
