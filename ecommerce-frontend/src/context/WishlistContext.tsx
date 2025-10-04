'use client'
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api"

interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
}
interface WishlistItem {
    id: number;
    product: Product;
}
interface WishlistContextType {
    wishlist: WishlistItem[];
    wishlistCount: number;
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (wishlistItemId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get("/wishlist");
            setWishlist(res.data);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const addToWishlist = async (productId: number) => {
        try {
            const res = await api.post(`/wishlist/add-to-wishlist?productId=${productId}`);
            setWishlist((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to add to wishlist", err);
        }
    };

    const removeFromWishlist = async (wishlistItemId: number) => {
        try {
            await api.delete(`wishlist/remove-from-wishlist?wishlistItemId=${wishlistItemId}`);
            setWishlist((prev) => prev.filter((item) => item.id !== wishlistItemId))
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistCount: wishlist.length,
                fetchWishlist,
                addToWishlist,
                removeFromWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if(!context)
        throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
}