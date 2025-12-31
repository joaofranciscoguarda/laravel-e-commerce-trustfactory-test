import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Order {
    id: number;
    order_number: string;
    customer: {
        name: string;
        email: string;
    };
    subtotal: number;
    discount: number;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    sort_by: string;
    sort_direction: string;
}

interface StatusCounts {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
}

interface OrdersIndexProps {
    orders: PaginatedOrders;
    filters: Filters;
    statusCounts: StatusCounts;
}

export default function OrdersIndex({
    orders,
    filters,
    statusCounts,
}: OrdersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            {
                search,
                status,
                date_from: dateFrom,
                date_to: dateTo,
            },
            { preserveState: true },
        );
    };

    const handleSort = (sortBy: string) => {
        const newDirection =
            filters.sort_by === sortBy && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/admin/orders',
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

    const getStatusColor = (orderStatus: string) => {
        switch (orderStatus) {
            case 'completed':
                return 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400';
            case 'processing':
                return 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400';
            case 'cancelled':
                return 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400';
            default:
                return 'border-foreground';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="border-b-2 border-foreground pb-4">
                    <h1 className="font-title text-4xl tracking-wider">
                        Order Management
                    </h1>
                    <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                        {orders.total} orders total
                    </p>
                </div>

                {/* Status Counts */}
                <div className="grid gap-4 md:grid-cols-4">
                    <button
                        onClick={() => {
                            setStatus('pending');
                            router.get(
                                '/admin/orders',
                                { status: 'pending' },
                                { preserveState: true },
                            );
                        }}
                        className="border-2 border-foreground bg-background p-4 text-left transition-colors hover:bg-muted"
                    >
                        <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                            Pending
                        </p>
                        <p className="mt-1 font-title text-2xl tracking-wider">
                            {statusCounts.pending}
                        </p>
                    </button>
                    <button
                        onClick={() => {
                            setStatus('processing');
                            router.get(
                                '/admin/orders',
                                { status: 'processing' },
                                { preserveState: true },
                            );
                        }}
                        className="border-2 border-foreground bg-background p-4 text-left transition-colors hover:bg-muted"
                    >
                        <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                            Processing
                        </p>
                        <p className="mt-1 font-title text-2xl tracking-wider">
                            {statusCounts.processing}
                        </p>
                    </button>
                    <button
                        onClick={() => {
                            setStatus('completed');
                            router.get(
                                '/admin/orders',
                                { status: 'completed' },
                                { preserveState: true },
                            );
                        }}
                        className="border-2 border-foreground bg-background p-4 text-left transition-colors hover:bg-muted"
                    >
                        <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                            Completed
                        </p>
                        <p className="mt-1 font-title text-2xl tracking-wider">
                            {statusCounts.completed}
                        </p>
                    </button>
                    <button
                        onClick={() => {
                            setStatus('cancelled');
                            router.get(
                                '/admin/orders',
                                { status: 'cancelled' },
                                { preserveState: true },
                            );
                        }}
                        className="border-2 border-foreground bg-background p-4 text-left transition-colors hover:bg-muted"
                    >
                        <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
                            Cancelled
                        </p>
                        <p className="mt-1 font-title text-2xl tracking-wider">
                            {statusCounts.cancelled}
                        </p>
                    </button>
                </div>

                {/* Search and Filters */}
                <form
                    onSubmit={handleSearch}
                    className="border-2 border-foreground bg-muted p-4"
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by order # or customer..."
                                    className="w-full border-2 border-foreground bg-background px-4 py-2 pr-10 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                                />
                                <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="status" className="sr-only">
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border-2 border-foreground bg-background px-4 py-2 font-heading text-sm tracking-wider uppercase focus:ring-2 focus:ring-foreground focus:outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date_from" className="sr-only">
                                From Date
                            </label>
                            <input
                                type="date"
                                id="date_from"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full border-2 border-foreground bg-background px-4 py-2 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="date_to" className="sr-only">
                                To Date
                            </label>
                            <input
                                type="date"
                                id="date_to"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full border-2 border-foreground bg-background px-4 py-2 font-sans text-sm focus:ring-2 focus:ring-foreground focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            className="border-2 border-foreground bg-foreground px-6 py-2 font-heading text-sm tracking-wider text-background uppercase transition-opacity hover:opacity-80"
                        >
                            Search
                        </button>
                        {(search || status || dateFrom || dateTo) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                    setDateFrom('');
                                    setDateTo('');
                                    router.get('/admin/orders');
                                }}
                                className="border-2 border-foreground bg-background px-6 py-2 font-heading text-sm tracking-wider uppercase transition-colors hover:bg-muted"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {/* Orders Table */}
                <div className="overflow-x-auto border-2 border-foreground">
                    <table className="w-full bg-background">
                        <thead className="border-b-2 border-foreground bg-muted">
                            <tr>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() =>
                                            handleSort('order_number')
                                        }
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Order #
                                        <SortIcon column="order_number" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-left font-heading text-xs tracking-wider uppercase">
                                    Customer
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-right">
                                    <button
                                        onClick={() => handleSort('total')}
                                        className="ml-auto flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Total
                                        <SortIcon column="total" />
                                    </button>
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-center font-heading text-xs tracking-wider uppercase">
                                    Status
                                </th>
                                <th className="border-r-2 border-foreground p-4 text-left">
                                    <button
                                        onClick={() => handleSort('date')}
                                        className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase transition-opacity hover:opacity-80"
                                    >
                                        Date
                                        <SortIcon column="date" />
                                    </button>
                                </th>
                                {/*<th className="p-4 text-center font-heading text-xs tracking-wider uppercase">
                                    Actions
                                </th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b-2 border-foreground transition-colors last:border-b-0 hover:bg-muted"
                                >
                                    <td className="border-r-2 border-foreground p-4">
                                        <p className="font-heading text-sm tracking-wider">
                                            {order.order_number}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4">
                                        <p className="font-sans text-sm">
                                            {order.customer.name}
                                        </p>
                                        <p className="mt-1 font-sans text-xs text-muted-foreground">
                                            {order.customer.email}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4 text-right">
                                        <p className="font-title text-sm tracking-wider">
                                            ${order.total.toFixed(2)}
                                        </p>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4 text-center">
                                        <span
                                            className={`inline-block border-2 px-2 py-1 font-sans text-xs uppercase ${getStatusColor(
                                                order.status,
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="border-r-2 border-foreground p-4">
                                        <p className="font-sans text-sm">
                                            {order.created_at}
                                        </p>
                                    </td>
                                    {/*<td className="p-4 text-center">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-block border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                        >
                                            View
                                        </Link>
                                    </td>*/}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between border-2 border-foreground bg-muted p-4">
                        <p className="font-sans text-sm text-muted-foreground">
                            Page {orders.current_page} of {orders.last_page}
                        </p>
                        <div className="flex gap-2">
                            {orders.current_page > 1 && (
                                <Link
                                    href={`/admin/orders?page=${orders.current_page - 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Previous
                                </Link>
                            )}
                            {orders.current_page < orders.last_page && (
                                <Link
                                    href={`/admin/orders?page=${orders.current_page + 1}`}
                                    preserveState
                                    className="border-2 border-foreground bg-background px-4 py-2 font-heading text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {orders.data.length === 0 && (
                    <div className="border-2 border-foreground bg-background p-12 text-center">
                        <p className="font-heading text-sm tracking-wider text-muted-foreground uppercase">
                            No orders found
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
