'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface OrderItem {
    product: { name: string, price: number, imageUrl: string };
    quantity: number;
}
interface Order {
    id: number,
    items: OrderItem[];
    totalPrice: number;
    date: string;
    status: string;
}

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>(); 
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        api.get(`/order/orderhistory`)
            .then(res => {
                const found = res.data.find((o: Order) => o.id === Number(id));
                if(found)
                    setOrder(found);
                else
                    setError("Order not found");
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch order details")
            })
            .finally(() => setLoading(false))
    }, [id]);

    const handlePayment = async () => {
        try {
            await api.post(`order/pay/${id}`);
            router.push("/orders");
        } catch (err) {
            console.error(err);
            setError("Payment failed");
        }
    };

    if(loading) return <p className="p-6">Loading...</p>
    if(error) return <p className="p-6 text-red-600">{error}</p>
    if(!order) return null;

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.date).toLocaleString()}</p>
            <div className="mt-4">
                {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                        <span>{item.product.name} (x{item.quantity})</span>
                        <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 font-bold">Total: ₹{order.totalPrice.toFixed(2)}</div>
            {order.status === "PLACED" && (
                <button onClick={handlePayment} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Pay Now
                </button>
            )}
        </div>
    );
}