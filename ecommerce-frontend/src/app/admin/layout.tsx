'use client';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if(user && user.role != "ADMIN") {
            router.push("/");
        }
    }, [user, router]);

    if(!user) return <p className="p-6">Checking permission...</p>;

    return (
        <div className="flex min-f-screen">
            {/* Sidebar */}
            <aside className="w-54 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-lg font-bold border-b border-gray-700">
                    Admin Dashboard
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link href="/admin/products"
                        className={`p-2 rounded ${pathname.startsWith("/admin/products") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                    >
                        Products
                    </Link>
                    <Link href="/admin/users"
                        className={`p-2 rounded ${pathname.startsWith("/admin/users") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                    >
                        Users
                    </Link>
                    <Link href="/admin/transactions"
                        className={`p-2 rounded ${pathname.startsWith("/admin/transactions") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                    >
                        Transactions
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="w-full bg-red-600 py-2 rounded hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-100 p-6">
                {children}
            </main>
        </div>
    );
}