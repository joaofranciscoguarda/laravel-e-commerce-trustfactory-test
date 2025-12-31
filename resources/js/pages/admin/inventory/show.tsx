import AdminLayout from '@/layouts/admin-layout';
import { Item } from '@/types/models';
import { router, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Package } from 'lucide-react';
import { FormEvent } from 'react';

interface Batch {
    id: number;
    batch_number: string;
    initial_quantity: number;
    remaining_quantity: number;
    received_date: string;
    cost_per_unit: number;
}

interface InventoryShowProps {
    item: Item & {
        batches: Batch[];
    };
}

export default function InventoryShow({ item }: InventoryShowProps) {
    const { data, setData, put, processing, errors } = useForm({
        base_price: item.base_price,
        discount_percentage: item.discount_percentage,
        low_stock_threshold: item.low_stock_threshold,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/inventory/${item.id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = () => {
        router.post(
            `/admin/inventory/${item.id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Back Button */}
                <a
                    href="/admin/inventory"
                    className="inline-flex items-center gap-2 font-heading text-sm tracking-wider text-muted-foreground uppercase transition-opacity hover:opacity-80"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Inventory
                </a>

                {/* Page Header */}
                <div className="border-b-2 border-foreground pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-title text-4xl tracking-wider">
                                {item.title}
                            </h1>
                            <p className="mt-2 font-heading text-sm tracking-wider text-muted-foreground uppercase">
                                by {item.author}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleActive}
                            className={`border-2 px-4 py-2 font-heading text-sm tracking-wider uppercase transition-colors ${
                                item.is_active
                                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-background dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400'
                                    : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-background dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400'
                            }`}
                            disabled={
                                !item.is_active && item.available_stock === 0
                            }
                            title={
                                !item.is_active && item.available_stock === 0
                                    ? 'Cannot activate item with zero stock'
                                    : ''
                            }
                        >
                            {item.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Item Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Stock Status Card */}
                        <div
                            className={`border-2 p-6 ${
                                item.is_low_stock
                                    ? 'border-orange-500 bg-orange-500/10 dark:border-orange-400'
                                    : 'border-foreground bg-background'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.is_low_stock && (
                                    <AlertTriangle className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                                )}
                                <div className="flex-1">
                                    <h2 className="font-heading text-lg tracking-wider uppercase">
                                        Stock Status
                                    </h2>
                                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                                        <div>
                                            <p className="font-sans text-xs text-muted-foreground">
                                                Available Stock
                                            </p>
                                            <p
                                                className={`mt-1 font-title text-2xl tracking-wider ${
                                                    item.available_stock === 0
                                                        ? 'text-destructive'
                                                        : item.is_low_stock
                                                          ? 'text-orange-500 dark:text-orange-400'
                                                          : ''
                                                }`}
                                            >
                                                {item.available_stock}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-sans text-xs text-muted-foreground">
                                                Total Stock
                                            </p>
                                            <p className="mt-1 font-title text-2xl tracking-wider">
                                                {item.total_stock}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-sans text-xs text-muted-foreground">
                                                Low Stock Threshold
                                            </p>
                                            <p className="mt-1 font-title text-2xl tracking-wider">
                                                {item.low_stock_threshold}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="border-2 border-foreground bg-background">
                            <div className="border-b-2 border-foreground bg-muted p-4">
                                <h2 className="font-heading text-lg tracking-wider uppercase">
                                    Edit Item Details
                                </h2>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 p-6"
                            >
                                <div>
                                    <label
                                        htmlFor="base_price"
                                        className="block font-heading text-sm tracking-wider uppercase"
                                    >
                                        Base Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="base_price"
                                        step="0.01"
                                        min="0"
                                        max="9999.99"
                                        value={data.base_price}
                                        onChange={(e) =>
                                            setData(
                                                'base_price',
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="mt-2 w-full border-2 border-foreground bg-background px-4 py-2 font-sans focus:ring-2 focus:ring-foreground focus:outline-none"
                                    />
                                    {errors.base_price && (
                                        <p className="mt-1 font-sans text-xs text-destructive">
                                            {errors.base_price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="discount_percentage"
                                        className="block font-heading text-sm tracking-wider uppercase"
                                    >
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="discount_percentage"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.discount_percentage}
                                        onChange={(e) =>
                                            setData(
                                                'discount_percentage',
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="mt-2 w-full border-2 border-foreground bg-background px-4 py-2 font-sans focus:ring-2 focus:ring-foreground focus:outline-none"
                                    />
                                    {errors.discount_percentage && (
                                        <p className="mt-1 font-sans text-xs text-destructive">
                                            {errors.discount_percentage}
                                        </p>
                                    )}
                                    <p className="mt-2 font-sans text-sm text-muted-foreground">
                                        Final Price: $
                                        {(
                                            data.base_price *
                                            (1 - data.discount_percentage / 100)
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="low_stock_threshold"
                                        className="block font-heading text-sm tracking-wider uppercase"
                                    >
                                        Low Stock Threshold
                                    </label>
                                    <input
                                        type="number"
                                        id="low_stock_threshold"
                                        min="0"
                                        max="1000"
                                        value={data.low_stock_threshold}
                                        onChange={(e) =>
                                            setData(
                                                'low_stock_threshold',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="mt-2 w-full border-2 border-foreground bg-background px-4 py-2 font-sans focus:ring-2 focus:ring-foreground focus:outline-none"
                                    />
                                    {errors.low_stock_threshold && (
                                        <p className="mt-1 font-sans text-xs text-destructive">
                                            {errors.low_stock_threshold}
                                        </p>
                                    )}
                                    <p className="mt-2 font-sans text-sm text-muted-foreground">
                                        Alert will trigger when stock drops to
                                        or below this number
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm tracking-wider text-background uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Batches Table */}
                        <div className="border-2 border-foreground bg-background">
                            <div className="border-b-2 border-foreground bg-muted p-4">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    <h2 className="font-heading text-lg tracking-wider uppercase">
                                        Stock Batches (FIFO Order)
                                    </h2>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                {item.batches?.length > 0 ? (
                                    <table className="w-full">
                                        <thead className="border-b-2 border-foreground bg-muted">
                                            <tr>
                                                <th className="border-r-2 border-foreground p-3 text-left font-heading text-xs tracking-wider uppercase">
                                                    Batch #
                                                </th>
                                                <th className="border-r-2 border-foreground p-3 text-left font-heading text-xs tracking-wider uppercase">
                                                    Received Date
                                                </th>
                                                <th className="border-r-2 border-foreground p-3 text-right font-heading text-xs tracking-wider uppercase">
                                                    Initial
                                                </th>
                                                <th className="border-r-2 border-foreground p-3 text-right font-heading text-xs tracking-wider uppercase">
                                                    Remaining
                                                </th>
                                                <th className="p-3 text-right font-heading text-xs tracking-wider uppercase">
                                                    Cost/Unit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.batches?.map((batch) => (
                                                <tr
                                                    key={batch.id}
                                                    className="border-b-2 border-foreground last:border-b-0"
                                                >
                                                    <td className="border-r-2 border-foreground p-3 font-sans text-sm">
                                                        {batch.batch_number}
                                                    </td>
                                                    <td className="border-r-2 border-foreground p-3 font-sans text-sm">
                                                        {batch.received_date}
                                                    </td>
                                                    <td className="border-r-2 border-foreground p-3 text-right font-sans text-sm">
                                                        {batch.initial_quantity}
                                                    </td>
                                                    <td className="border-r-2 border-foreground p-3 text-right font-sans text-sm">
                                                        <span
                                                            className={
                                                                batch.remaining_quantity ===
                                                                0
                                                                    ? 'text-muted-foreground'
                                                                    : 'font-bold'
                                                            }
                                                        >
                                                            {
                                                                batch.remaining_quantity
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right font-sans text-sm">
                                                        $
                                                        {batch.cost_per_unit.toFixed(
                                                            2,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="p-8 text-center font-sans text-sm text-muted-foreground">
                                        No batches available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image */}
                        <div className="border-2 border-foreground bg-background p-4">
                            <img
                                src={`/storage/${item.image_path}`}
                                alt={item.title}
                                className="w-full border-2 border-foreground"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>

                        {/* Info Card */}
                        <div className="border-2 border-foreground bg-background p-4">
                            <h3 className="font-heading text-sm tracking-wider uppercase">
                                Item Information
                            </h3>
                            <dl className="mt-4 space-y-3">
                                <div>
                                    <dt className="font-sans text-xs text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd className="mt-1">
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
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-sans text-xs text-muted-foreground">
                                        Current Price
                                    </dt>
                                    <dd className="mt-1 font-title text-xl tracking-wider">
                                        ${item.final_price?.toFixed(2)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-sans text-xs text-muted-foreground">
                                        Added On
                                    </dt>
                                    <dd className="mt-1 font-sans text-sm">
                                        {item.created_at}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-sans text-xs text-muted-foreground">
                                        Total Batches
                                    </dt>
                                    <dd className="mt-1 font-sans text-sm">
                                        {item.batches?.length}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Description */}
                        <div className="border-2 border-foreground bg-background p-4">
                            <h3 className="font-heading text-sm tracking-wider uppercase">
                                Description
                            </h3>
                            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
