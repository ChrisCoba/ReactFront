// Cart type definitions
export interface CartItem {
    tourId: string;
    name: string;
    image?: string;
    price: number;
    duration: number;
    adults: number;
    children: number;
    date: string;
    reservationId?: string;
    addedAt: string;
}

export interface CartTotals {
    subtotal: string;
    taxes: string;
    total: string;
}
