import type { CartItem, CartTotals } from '../types/Cart';

export const CartService = {
    STORAGE_KEY: 'agencia_cart',

    getCart(): CartItem[] {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addToCart(
        tourId: string,
        name: string,
        price: number,
        duration: number,
        adults: number,
        children: number,
        date: string,
        image?: string,
        reservationId?: string
    ): CartItem[] {
        const cart = this.getCart();
        const newItem: CartItem = {
            tourId,
            name,
            image,
            price,
            duration,
            adults,
            children,
            date,
            reservationId,
            addedAt: new Date().toISOString(),
        };

        cart.push(newItem);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));

        // Dispatch custom event for cart updates
        window.dispatchEvent(new Event('cartUpdated'));

        return cart;
    },

    removeFromCart(index: number): CartItem[] {
        const cart = this.getCart();
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        return cart;
    },

    clearCart(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new Event('cartUpdated'));
    },

    calculateTotal(): CartTotals {
        const cart = this.getCart();
        let subtotal = 0;

        cart.forEach((item) => {
            const adultTotal = item.price * item.adults;
            const childTotal = item.price * 0.5 * item.children; // 50% discount for children
            subtotal += adultTotal + childTotal;
        });

        const taxes = subtotal * 0.12; // 12% tax
        const total = subtotal + taxes;

        return {
            subtotal: subtotal.toFixed(2),
            taxes: taxes.toFixed(2),
            total: total.toFixed(2),
        };
    },

    getCartCount(): number {
        return this.getCart().length;
    },
};
