'use client';
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    if (wishlist.length === 0) return <p className="p-6">Your wishlist is empty.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map(item => (
                    <div key={item.id} className="border rounded-lg p-4">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-48 object-cover rounded" />
                        <h2 className="font-semibold mt-2">{item.product.name}</h2>
                        <p className="text-gray-600">{item.product.name}</p>
                        <p className="font-bold">₹{item.product.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                            <Link href={`/products/${item.product.id}`} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                View
                            </Link>
                            <button onClick={() => removeFromWishlist(item.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}