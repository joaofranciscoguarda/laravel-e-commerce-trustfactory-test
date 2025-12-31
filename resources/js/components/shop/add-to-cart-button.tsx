import { Item } from '@/types/models';
import { router, useForm } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
    item: Item;
    initialQuantity?: number;
}

export function AddToCartButton({
    item,
    initialQuantity = 0,
}: AddToCartButtonProps) {
    const [inCart, setInCart] = useState(initialQuantity > 0);
    const [quantity, setQuantity] = useState(
        initialQuantity > 0 ? initialQuantity : 1,
    );
    const { post, processing } = useForm({
        item_id: item.id,
        quantity: 1,
    });
    const { put: updateCart, processing: updating } = useForm({
        quantity: 1,
    });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        post('/cart/add', {
            preserveScroll: true,
            onSuccess: () => {
                setInCart(true);
                setQuantity(1);
            },
        });
    };

    const handleUpdateQuantity = (newQuantity: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (newQuantity <= 0) {
            router.delete(`/cart/${item.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setInCart(false);
                    setQuantity(1);
                },
            });
            return;
        }

        if (newQuantity > item.available_stock) {
            return;
        }

        setQuantity(newQuantity);
        updateCart(`/cart/${item.id}`, {
            data: { quantity: newQuantity },
            preserveScroll: true,
        });
    };

    if (inCart) {
        return (
            <div className="flex w-full items-center justify-center border-foreground bg-muted px-2 py-2">
                <button
                    onClick={(e) => handleUpdateQuantity(quantity - 1, e)}
                    disabled={updating}
                    className="flex w-[30%] justify-center border-2 border-foreground bg-background p-1 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Minus className="h-3 w-3" />
                </button>
                <span className="text-md min-w-[2rem] text-center font-sans font-bold">
                    {quantity}
                </span>
                <button
                    onClick={(e) => handleUpdateQuantity(quantity + 1, e)}
                    disabled={updating || quantity >= item.available_stock}
                    className="flex w-[30%] justify-center border-2 border-foreground bg-background p-1 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-3 w-3" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={processing || item.available_stock === 0}
            className="flex w-full items-center justify-center gap-2 border-2 border-foreground bg-background px-3 py-2 font-sans text-xs transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
            <ShoppingCart className="h-3 w-3" />
            {processing
                ? 'Adding...'
                : item.available_stock === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
        </button>
    );
}
