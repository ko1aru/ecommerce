'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWishlist } from "@/context/WishlistContext";
import api from "@/lib/api";

interface Rating {
    id: number;
    rating: number;
    review: string;
    productId: number;
    username: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    averageRating: number;
    ratings: Rating[];
    wishlisted: boolean;
}

export default function ProductDetail() {
    const { id } = useParams<{id: string}>();
    const productId = id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    const [rating, setRating] = useState<number>(5);
    const [review, setReview] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const isWishlisted = product ? wishlist.some((item) => item.product.id === product.id) : false;

    const fetchProduct = async () => {
        if (!productId) return;
        try {
            const res = await api.get(`/products/${productId}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    }

    const toggleWishlist = async () => {
        if(!product) return;
        try {
            if(product.wishlisted) {
                const wishlistItem = wishlist.find((item) => item.product.id === product.id);
                if(wishlistItem) {
                    await removeFromWishlist(wishlistItem.id);
                    setProduct({ ...product, wishlisted: false });
                }
            } else {
                await addToWishlist(product.id);
                setProduct({ ...product, wishlisted: true });
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.post(`/products/${productId}/add-rating`, { rating, review });
            const updatedProduct = await api.get(`/products/${productId}`);
            setProduct(updatedProduct.data);
            setReview("");
            setRating(5);
        } catch(err) {
            console.error(err);
            setError("Failed to submit review.");
        } finally{
            setSubmitting(false)
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        setCartMessage(null);
        try {
            await api.post(`/cart/add`, 
                { productId: Number(productId), quantity }
            );
            setCartMessage("Added to cart");
        } catch(error) {
            console.error(error);
            setCartMessage("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    }

    useEffect(() => {
        fetchProduct();
        console.log("isWishlisted: ", isWishlisted);
    }, [productId]);

    if(loading) return <p className="p-6">Loading Product...</p>
    if(!product) return <p className="p-6">Product not found.</p>

    return (
        <ProtectedRoute>
            <div className="p-6">
                {/* Product Info */}
                <img src={product.imageUrl} alt={product.name} className="w-64 h-64 object-cover rounded mb-4" />
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="mt-2">{product.brand}</p>
                <p>Category: {product.category}</p>
                <p className="font-bold text-lg mt-2">₹{product.price.toFixed(2)}</p>

                {/* Wishlist Toggle */}
                <button onClick={toggleWishlist}
                    className={`mt-4 px-4 py-2 rounded ${
                        product.wishlisted ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                >
                    {product.wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>

                {/* Add to Cart */}
                <div className="mt-4 flex items-center gap-2">
                    <label>Quantity: </label>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border p-1 w-16"
                    />
                    <button onClick={handleAddToCart} disabled={addingToCart} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
                {cartMessage && <p className="mt-2">{cartMessage}</p>}

                <p>Stock: {product.stock}</p>
                <p>Average Rating: {product.averageRating}</p>
                {/* Ratings List */}
                {product.ratings && product.ratings.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-x1 font-bold mb-2">Reviews</h2>
                        <ul className="space-y-4">
                            {product.ratings.map(r => (
                                <li key={r.id} className="border p-4 rounded">
                                    <p className="font-semibold">{r.username}</p>
                                    <p>Rating: {r.rating} / 5</p>
                                    <p className="text-gray-600">{r.review}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="mt-6 text-gray-500">No reviews yet.</p>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">{/* border p-4 rounded */}
                    <h2 className="text-lg font-bold mb-2">Add a Review</h2>
                    <div>
                        <label className="block font-medium">Rating</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border rounded p-2 w-full"
                        >
                            {[5, 4, 3, 2, 1].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Review</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="border p-2 w-full mb-4"
                            rows={3}
                        />
                    </div>
                    
                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}