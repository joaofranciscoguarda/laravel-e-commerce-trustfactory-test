import ShopLayout from '@/layouts/shop-layout';
import { SharedData } from '@/types';
import { Order } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Package, Truck } from 'lucide-react';

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const { flash } = usePage<SharedData>().props;
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
            <Head
                title={`Order #${order.order_number} - Dark Fantasy Bookstore`}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/orders"
                    className="mb-6 inline-flex items-center gap-2 font-heading text-sm tracking-wider uppercase transition-opacity hover:opacity-80"
                >
                    ← Back to Orders
                </Link>

                {/* Success Message */}
                {flash?.success && (
                    <div className="mb-6 border-2 border-green-500 bg-green-500/10 p-6">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                            <div>
                                <p className="mb-1 font-heading text-lg text-green-700">
                                    Order Confirmed!
                                </p>
                                <p className="font-sans text-sm text-green-600">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Header */}
                <div className="mb-6 border-2 border-foreground bg-background p-6">
                    <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="mb-2 font-title text-3xl tracking-wider md:text-4xl">
                                Order #{order.order_number}
                            </h1>
                            <p className="font-sans text-sm text-muted-foreground">
                                Placed on{' '}
                                {new Date(order.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </p>
                        </div>
                        <span
                            className={`inline-block border-2 px-4 py-2 font-heading text-sm uppercase ${getStatusColor(order.status)}`}
                        >
                            {order.status}
                        </span>
                    </div>

                    {/* Order Status Info */}
                    <div className="grid gap-4 border-t-2 border-foreground pt-4 md:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Package className="mt-1 h-5 w-5 opacity-70" />
                            <div>
                                <p className="mb-1 font-heading text-sm uppercase">
                                    Items
                                </p>
                                <p className="font-sans text-sm text-muted-foreground">
                                    {order.items?.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0,
                                    ) || 0}{' '}
                                    item(s)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Truck className="mt-1 h-5 w-5 opacity-70" />
                            <div>
                                <p className="mb-1 font-heading text-sm uppercase">
                                    Payment
                                </p>
                                <p className="font-sans text-sm text-muted-foreground">
                                    {order.payment_status || 'Pending'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 opacity-70">$</div>
                            <div>
                                <p className="mb-1 font-heading text-sm uppercase">
                                    Total
                                </p>
                                <p className="font-heading text-xl">
                                    ${order.total}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 font-heading text-xl uppercase">
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.items?.map((orderItem) => (
                                <div
                                    key={orderItem.id}
                                    className="border-2 border-foreground bg-background p-4"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <Link
                                            href={`/shop/${orderItem.item.id}`}
                                            className="h-24 w-16 flex-shrink-0 overflow-hidden border-2 border-foreground md:h-28 md:w-20"
                                        >
                                            <img
                                                src={`/thumbnails/${orderItem.item.image_path}`}
                                                alt={orderItem.item.title}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/shop/${orderItem.item.id}`}
                                                className="mb-1 line-clamp-2 block font-title text-base hover:opacity-80 md:text-lg"
                                            >
                                                {orderItem.item.title}
                                            </Link>
                                            <p className="mb-2 font-sans text-sm text-muted-foreground">
                                                {orderItem.item.author}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-sans text-sm text-muted-foreground">
                                                    Qty: {orderItem.quantity}
                                                </p>
                                                <p className="font-heading text-base md:text-lg">
                                                    ${orderItem.subtotal}
                                                </p>
                                            </div>
                                            {orderItem.discount_applied > 0 && (
                                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                    Discount applied:{' '}
                                                    {orderItem.discount_applied}
                                                    %
                                                </p>
                                            )}
                                            {orderItem.batch && (
                                                <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                    Batch:{' '}
                                                    {
                                                        orderItem.batch
                                                            .batch_number
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                        Subtotal
                                    </span>
                                    <span>${order.subtotal}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between font-sans text-sm">
                                        <span className="text-muted-foreground">
                                            Discount
                                        </span>
                                        <span className="text-green-600">
                                            -${order.discount}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span>FREE</span>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-between font-heading text-xl">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>

                            {order.status === 'pending' && (
                                <Link
                                    href="/"
                                    className="block w-full border-2 border-foreground bg-foreground px-6 py-3 text-center font-heading text-sm tracking-wider text-background uppercase transition-colors hover:bg-background hover:text-foreground"
                                >
                                    Continue Shopping
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
