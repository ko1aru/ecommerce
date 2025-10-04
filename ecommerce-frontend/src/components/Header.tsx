'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRef, useState, useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";

export default function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between">
            <div>
                <Link href="/" className="text-xl font-bold">E-Commerce</Link>
            </div>
            <nav className="flex gap-4 items-center relative">
                {/* {isLoggedIn && ( */}
                {isLoggedIn ? (
                    <>
                        <Link href="/cart" className="hover:underline">
                            Cart{cartCount > 0 && ` (${cartCount})`}
                        </Link>
                        {/* <button onClick={logout} className="hover:underline">
                            Logout
                        </button> */}

                        {/*Profile Avatar*/}
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(prev => !prev)} className="focus:outline-none">
                                <img src="/default-avatar.png" alt="Profile" className="w-8 h-8 rounded-full border-2 border-white cursor-pointer" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                                    <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-300">Wishlist{wishlistCount > 0 && ` (${wishlistCount})`}</Link>
                                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-300">Orders</Link>
                                    <Link href="/transactions" className="block px-4 py-2 hover:bg-gray-300">Transaction History</Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-300">
                                        Logout
                                    </button>
                                    {/* Admin */}
                                    {user?.role === "ADMIN" && (
                                        <Link href="/admin" className="w-full text-left px-4 py-2 hover:bg-gray-300">Admin Dashboard</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                // )}
                // {!isLoggedIn && (
                    <>
                        <Link href="/login" className="hover:underline">Login</Link>
                        <Link href="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}