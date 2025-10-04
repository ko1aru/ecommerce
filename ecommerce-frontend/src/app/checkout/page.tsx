'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";

export default function CheckoutPage() {
    const { cartItems, cartCount, fetchCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const grandTotal = cartItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);

    const placeOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/order/placeorder');
            const orderId = res.data.id;
            fetchCart();
            router.push(`/orders/${orderId}`);
        } catch (err) {
            console.error(err);
            setError("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {error && <p className="text-red-600">{error}</p>}
            {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>₹{item.totalPrice.toFixed(2)}</span>
                </div>
            ))}
            <div className="mt-4 text-lb font-bold">
                Total: ₹{grandTotal.toFixed(2)}
            </div>
            <button onClick={placeOrder} disabled={loading} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
}