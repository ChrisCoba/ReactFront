import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CartService } from '../services/CartService';
import type { CartItem, CartTotals } from '../types/Cart';

interface CartContextType {
    cart: CartItem[];
    cartCount: number;
    totals: CartTotals;
    addToCart: (
        tourId: string,
        name: string,
        price: number,
        duration: number,
        adults: number,
        children: number,
        date: string,
        image?: string,
        reservationId?: string
    ) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    refreshCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totals, setTotals] = useState<CartTotals>({ subtotal: '0', taxes: '0', total: '0' });

    const refreshCart = () => {
        const currentCart = CartService.getCart();
        setCart(currentCart);
        setTotals(CartService.calculateTotal());
    };

    useEffect(() => {
        // Load cart on mount
        refreshCart();

        // Listen for cart updates
        const handleCartUpdate = () => {
            refreshCart();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const addToCart = (
        tourId: string,
        name: string,
        price: number,
        duration: number,
        adults: number,
        children: number,
        date: string,
        image?: string,
        reservationId?: string
    ) => {
        CartService.addToCart(tourId, name, price, duration, adults, children, date, image, reservationId);
        refreshCart();
    };

    const removeFromCart = (index: number) => {
        CartService.removeFromCart(index);
        refreshCart();
    };

    const clearCart = () => {
        CartService.clearCart();
        refreshCart();
    };

    const value: CartContextType = {
        cart,
        cartCount: cart.length,
        totals,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
