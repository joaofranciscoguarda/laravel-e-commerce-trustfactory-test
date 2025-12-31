export interface Item {
    id: number;
    title: string;
    author: string;
    description: string;
    image_path: string;
    base_price: number;
    discount_percentage: number;
    final_price: number;
    available_stock: number;
    total_stock: number;
    low_stock_threshold: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ItemBatch {
    id: number;
    item_id: number;
    batch_number: string;
    initial_quantity: number;
    remaining_quantity: number;
    cost_price: number;
    received_date: string;
    expiry_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    item_id: number;
    quantity: number;
    price_snapshot: number;
    item: Item;
    created_at: string;
    updated_at: string;
}

export interface Cart {
    id: number;
    user_id: number;
    last_activity: string | null;
    items?: CartItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    item_id: number;
    item_batch_id: number | null;
    quantity: number;
    unit_price: number;
    discount_applied: number;
    subtotal: number;
    item: Item;
    batch?: ItemBatch;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    order_number: string;
    subtotal: number;
    discount: number;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    payment_method: string | null;
    payment_status: string | null;
    shipping_address: string | null;
    notes: string | null;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
