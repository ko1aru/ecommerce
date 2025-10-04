'use client';
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Transaction {
    transactionId: number;
    orderId: number;
    amount: number;
    status: string;
    createdAt: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/user/transaction-history");
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load transactions")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if(loading) return <p className="p-6">Loading transactions...</p>
    if(error) return <p className="p-6 text-red-600">{error}</p>
    if(transactions.length === 0) return <p className="p-6">No transactions found.</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Transaction history</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-600">
                        <th className="border p-2">Transaction ID</th>
                        <th className="border p-2">Order ID</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.transactionId} className="text-center">
                            <td className="border p-2">{tx.transactionId}</td>
                            <td className="border p-2">{tx.orderId}</td>
                            <td className="border p-2">₹{tx.amount.toFixed(2)}</td>
                            <td className={`border p-2 font-semibold ${
                                tx.status === "SUCCESS" ? "text-green-600" : "text-red-600"
                            }`}>
                                {tx.status}
                            </td>
                            <td className="border p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}