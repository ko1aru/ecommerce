'use client';
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Product {
    id: number;
    name: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<Omit<Product, "id">>({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: 0,
        stock: 0,
        imageUrl: "",
    });

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(editingProduct) {
                if (!confirm("Are you sure you want to update this product?"))
                    return;
                await api.put(`/products/${editingProduct.id}`, form);
                setMessage("Product updated successfully!");
            } else {
                await api.post("products/add", form);
                setMessage("Product added successfully!");
            }
            setForm({ name: "", description: "", brand: "", category: "", price: 0, stock: 0, imageUrl: ""});
            setEditingProduct(null);
            fetchProducts();
        } catch {
            setError("Failed to save product");
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: product.category,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
        });
    };

    const handleDelete = async (id: number) => {
        if(!confirm("Are you sure you want to delete this product?"))
            return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch {
            setError("Failed to delete products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if(loading) return <p className="p-6">Loading products...</p>
    if(error) return <p className="p-6 text-red-600">{error}</p>

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Product Management</h1>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-6 border p-4 rounded">
                <h2 className="text-x1 font-semibold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
                <input type="text" placeholder="Name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border w-full p-2 rounded" required />
                
                <textarea placeholder="Description" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value})}
                    className="border w-full p-2 rounded" />
                
                <input type="text" placeholder="Brand" value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="border w-full p-2 rounded" required />

                <input type="text" placeholder="Category" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border w-full p-2 rounded" />

                <input type="number" placeholder="Price" value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="border w-full p-2 rounded" required />

                <input type="number" placeholder="Stock" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="border w-full p-2 rounded" required />

                <input type="text" placeholder="Image URL" value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="border w-full p-2 rounded" />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editingProduct ? "Update" : "Add"}
                </button>
                {editingProduct && (
                    <button type="button" onClick={() => { setEditingProduct(null); setForm({ name:"", description:"", brand:"", category:"", price:0, stock:0, imageUrl:"" }); }}
                        className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                )}
                {message && <p className="p-2 text-green-600">{message}</p>}
                {error && <p className="p-2 text-red-600">{error}</p>}
            </form>

            {/* Product List */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Image</th>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Brand</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Stock</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="text-center">
                            <td className="border p-2">
                                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                            </td>
                            <td className="border p-2">{p.id}</td>
                            <td className="border p-2">{p.name}</td>
                            <td className="border p-2">{p.brand}</td>
                            <td className="border p-2">{p.category}</td>
                            <td className="border p-2">₹{p.price}</td>
                            <td className="border p-2">{p.stock}</td>
                            <td className="border p-2 space-x-2">
                                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}