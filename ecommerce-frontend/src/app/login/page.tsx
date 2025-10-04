'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });
            const token = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            setError('');
            router.push('/');
        } catch(err: unknown) {
            if(err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: { message?:string } } };
                setError(error.response?.data?.message || 'Login failed');
            } else {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
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
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
                <div className="flex justify-between text-sm mt-4">
                    <a href="/register" className="text-blue-600 hover:underline">
                        Don’t have an account? Register
                    </a>
                    <a href="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                </div>
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