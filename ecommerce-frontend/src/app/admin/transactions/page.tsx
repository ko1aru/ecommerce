'use client';
import { useState } from "react";
import api from "@/lib/api";

interface Transaction {
    transactionId: number;
    orderId: number;
    amount: number;
    status: string;
    createdAt: string;
}

export default function AdminTransactionsPage() {
    const [username, setUsername] = useState("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        if(!username.trim())
            return;
        setLoading(false);
        setError(null);
        try {
            const res = await api.get(`/user/transaction-history/admin?username=${username}`);
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch transactions for this user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin - User Transactions</h1>

            {/* Search bar */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-64"
                />
                <button onClick={fetchTransactions} className="btn btn-primary">{/*className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">*/}
                    Search
                </button>
            </div>

            {/* Table */}
            {error ? (
                <p className="text-red-600">{error}</p>
            ) : transactions.length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-600 text-white">
                            <th className="border p-2">Transaction ID</th>
                            <th className="border p-2">Order ID</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.transactionId} className="text-center">
                                <td className="border p-2">{tx.transactionId}</td>
                                <td className="border p-2">{tx.orderId}</td>
                                <td className="border p-2">₹{tx.amount.toFixed(2)}</td>
                                <td className={`border p-2 font-semibold rounded-full text-white ${
                                    tx.status.trim().toLowerCase() === "success" ? "text-green-600 bg-green-600" : "bg-red-600"
                                }`}>
                                    {tx.status}
                                </td>
                                <td className="border p-2">
                                    {new Date(tx.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No transactions found</p>
            )}
        </div>
    );
}