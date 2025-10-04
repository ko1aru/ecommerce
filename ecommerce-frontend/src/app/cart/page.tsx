'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import Link from "next/link";

export default function CartPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cartItems, fetchCart } = useCart();
    const router = useRouter();

    const updateQuantity = async (itemId: number, newQty: number) => {
        if(newQty < 1) return;
        try {
            await api.put(`/cart/${itemId}`, { quantity: newQty });
            fetchCart();
        } catch (err) {
            console.error(err);
            setError("Failed to update quantity");
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/cart/${itemId}`);
            fetchCart();
        } catch (err) {
            console.error(err);
            setError("Failed to remove item");
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                await fetchCart();
            } catch {
                setError("Failed to load cart");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if(loading) return <p className="p-6">Loading Cart...</p>
    if(error) return <p className="p-6 text-red-600">{error}</p>
    if(cartItems.length === 0) return <p className="p-6">Your cart is empty. <Link href="/">Go shopping</Link></p>;

    const grandTotal = cartItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b py-4 gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                        <h2 className="font-semibold">{item.product.name}</h2>
                        <p>₹{item.product.price.toFixed(2)}</p>
                    </div>
                    <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="border w-16 text-center"
                    />
                    <p className="font-semibold">₹{item.product.price.toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        Remove
                    </button>
                </div>
            ))}
            <div className="text-right mt-4 font-bold text-lg">
                Total: ₹{grandTotal.toFixed(2)}
            </div>
            <button onClick={() => router.push("/checkout")} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Proceed to Checkout
            </button>
        </div>
    );
}