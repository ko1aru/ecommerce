'use client';
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
    username: string;
    email: string;
    profilePicUrl: string;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/user/all");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const makeAdmin = async (username: string) => {
        if(!confirm(`Make ${username} an admin?`))
            return;
        try {
            await api.put(`/user/makeuserasadmin?username=${username}`);
            setMessage(`${username} is now as admin`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError("Failed to update user role");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p className="p-6">Loading users...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
            {message && <p className="text-green-600">{message}</p>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.username} className="text-center">
                            <td className="border p-2">{u.username}</td>
                            <td className="border p-2">{u.email}</td>
                            <td className="border p-2">{u.role}</td>
                            <td className="border p-2">
                                {u.role !== "ADMIN" && (
                                    <button onClick={() => makeAdmin(u.username)} className="bg-blue-600 text-white px-3 py-1 rounded">
                                        Make Admin
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}