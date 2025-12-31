import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    orders_count: number;
    total_spent: number;
    created_at: string;
}

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    sort_by: string;
    sort_direction: string;
}

interface CustomersIndexProps {
    customers: PaginatedCustomers;
    filters: Filters;
    totalCustomers: number;
}

export default function CustomersIndex({
    customers,
    filters,
    totalCustomers,
}: CustomersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/customers',
            { search },
            { preserveState: true },
        );
    };

    const handleSort = (sortBy: string) => {
        const newDirection =
            filters.sort_by === sortBy && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/admin/customers',
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
                        Customer Management
                    </h1>
                    <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                        {totalCustomers} customers total
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex gap-4 border-2 border-foreground bg-muted p-4"
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
                                placeholder="Search by name or email..."
                                className="w-full border-2 border-foreground bg-background px-4 py-2 pr-10 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                            />
                            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="border-2 border-foreground bg-foreground px-6 py-2 font-heading text-sm tracking-wider text-background uppercase transition-opacity hover:opacity-80"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/customers');
                            }}
                            className="border-2 border-foreground bg-background px-6 py-2 font-heading text-sm tracking-wider uppercase transition-colors hover:bg-muted"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Customers Table */}
                <div className="overflow-x-auto border-2 border-foreground">
                    <table className="w-full bg-background">
                        <thead className="border-b-2 border-foreground bg-muted">
                            <tr>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('name')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Customer
                                        <SortIcon column="name" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-right">
                                    <button
                                        onClick={() => handleSort('orders')}
                                        className="ml-auto flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Orders
                                        <SortIcon column="orders" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-right">
                                    <button
                                        onClick={() => handleSort('total_spent')}
                                        className="ml-auto flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Total Spent
                                        <SortIcon column="total_spent" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('date')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Joined
                                        <SortIcon column="date" />
                                    </button>
                                </th>
                                <th className="p-4 text-center font-heading text-xs tracking-wider uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="border-b-2 border-foreground transition-colors last:border-b-0 hover:bg-muted"
                                >
                                    <td className="border-r-2 border-foreground p-4">
                                        <p className="font-heading text-sm tracking-wider">
                                            {customer.name}
                                        </p>
                                        <p className="mt-1 font-sans text-xs text-muted-foreground">
                                            {customer.email}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4 text-right">
                                        <p className="font-sans text-sm">
                                            {customer.orders_count}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4 text-right">
                                        <p className="font-title text-sm tracking-wider">
                                            ${customer.total_spent.toFixed(2)}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4">
                                        <p className="font-sans text-sm">
                                            {customer.created_at}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link
                                            href={`/admin/customers/${customer.id}`}
                                            className="inline-block border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {customers.last_page > 1 && (
                    <div className="flex items-center justify-between border-2 border-foreground bg-muted p-4">
                        <p className="font-sans text-sm text-muted-foreground">
                            Page {customers.current_page} of {customers.last_page}
                        </p>
                        <div className="flex gap-2">
                            {customers.current_page > 1 && (
                                <Link
                                    href={`/admin/customers?page=${customers.current_page - 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Previous
                                </Link>
                            )}
                            {customers.current_page < customers.last_page && (
                                <Link
                                    href={`/admin/customers?page=${customers.current_page + 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {customers.data.length === 0 && (
                    <div className="border-2 border-foreground bg-background p-12 text-center">
                        <p className="font-heading text-sm tracking-wider text-muted-foreground uppercase">
                            No customers found
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
