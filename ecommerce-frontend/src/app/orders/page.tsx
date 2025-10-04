'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Product{
    id: number;
    name: string;
    price: number;
    imageUrl: string
}
interface OrderItem {
    product: Product;
    quantity: number;
}
interface Order {
    id: number,
    items: OrderItem[];
    totalPrice: number;
    date: string;
    status: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/order/orderhistory');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: number) => {
        if(!confirm("Are you sure you want to cancel this order?"))
            return;
        try {
            await api.delete(`order/${orderId}`);
            fetchOrders();
        } catch (err) {
            console.error(err);
            setError("Failed to cancel order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if(loading) return <p className="p-6">Loading orders...</p>;
    if(error) return <p className="p-6 text-red-600">{error}</p>
    if(orders.length === 0) return <p className="p-6">No orders found.</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="border p-4 rounded bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Orders #{order.id}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(order.date).toLocaleString()}</p>
                                <p className={`font-bold mt-1 ${
                                    order.status === "CANCELLED" ? "text-red-600" :
                                    order.status === "PLACED" ? "text-orange-500" :
                                    "text-green-600"
                                }`}>
                                    {/*Status: */}{order.status}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Total: ₹{Number(order.totalPrice.toFixed(2))}</p>
                                {order.status === "PLACED" && (
                                    <button onClick={() => cancelOrder(order.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-2">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 border-t pt-2">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <p>{item.product.name} x {item.quantity}</p>
                                    <p>₹{item.product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <Link href={`/orders/${order.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}