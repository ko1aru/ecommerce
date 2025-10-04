'use client';

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    totalPrice: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartCount: cartItems.length, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if(!context)
        throw new Error('useCart must be used within a CartProvider');
    return context;
}