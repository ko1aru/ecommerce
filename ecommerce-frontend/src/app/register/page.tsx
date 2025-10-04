'use client';

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                email,
                username,
                password
            });
            setError('');
            alert("Registration successful! Please check your email to verify your account.");
            router.push('/login');
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(error.response?.data?.message || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="max-w-wd mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Register
                </button>
                <a
                    href="http://localhost:8080/oauth2/authorization/google"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 block text-center"
                >
                    Continue with Google
                </a>
            </form>
        </div>
    );
}