import ShopLayout from '@/layouts/shop-layout';
import { Order, PaginatedData } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { Package } from 'lucide-react';

interface Props {
    orders: PaginatedData<Order>;
}

export default function Index({ orders }: Props) {
    const getStatusColor = (status: Order['status']) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500',
            processing: 'bg-blue-500/20 text-blue-700 border-blue-500',
            completed: 'bg-green-500/20 text-green-700 border-green-500',
            cancelled: 'bg-red-500/20 text-red-700 border-red-500',
        };
        return colors[status] || colors.pending;
    };

    return (
        <ShopLayout>
            <Head title="My Orders - Dark Fantasy Bookstore" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 font-title text-3xl tracking-wider md:text-5xl">
                    My Orders
                </h1>

                {orders.data.length === 0 ? (
                    <div className="border-2 border-foreground py-16 text-center">
                        <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
                        <p className="mb-2 font-heading text-xl">
                            No orders yet
                        </p>
                        <p className="mb-6 font-sans text-sm text-muted-foreground">
                            Start shopping to see your orders here
                        </p>
                        <Link
                            href="/"
                            className="inline-block border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                        >
                            Browse Books
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block border-2 border-foreground bg-background p-4 transition-colors hover:bg-muted md:p-6"
                                >
                                    <div className="mb-4 flex flex-col justify-between gap-4 border-b-2 border-foreground pb-4 md:flex-row md:items-center">
                                        <div>
                                            <h2 className="mb-1 font-heading text-lg md:text-xl">
                                                Order #{order.order_number}
                                            </h2>
                                            <p className="font-sans text-sm text-muted-foreground">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`inline-block border-2 px-3 py-1 font-sans text-xs uppercase ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                            <span className="font-heading text-xl">
                                                ${order.total}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-sans text-sm text-muted-foreground">
                                            {order.items?.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0,
                                            ) || 0}{' '}
                                            item(s)
                                        </p>
                                        <span className="font-sans text-sm text-muted-foreground">
                                            View Details →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {orders.links.map((link, index) => (
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
                )}
            </div>
        </ShopLayout>
    );
}
