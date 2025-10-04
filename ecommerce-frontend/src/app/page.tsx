'use client';

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import api from "@/lib/api";

interface Product {
  id: number,
  name: string;
  description: string;
  brand: string,
  category: string,
  price: number;
  stock: number,
  imageUrl: string,
  averageRating: number,
  isWishlisted: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Reset Function
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
  };

  useEffect(() => {
    api.get('/products')
    .then(res => {
      setProducts(res.data);
      setFiltered(res.data);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load products");
    })
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];

    // --- Filtering ---
    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (minPrice !== "" && maxPrice !== "") {
      result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    } else if (minPrice !== "") {
      result = result.filter((p) => p.price >= minPrice);
    } else if (maxPrice !== "") {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // --- Sorting ---
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "newest") {
      result.sort((a, b) => b.id - a.id); // or use createdAt if available
    }

    setFiltered(result);
  }, [search, category, minPrice, maxPrice, sort, products]);

  if(loading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <input
            type="text"
            placeholder="Search by name or brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
            <option value="newest">Newest First</option>
          </select>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
              className="border p-2 rounded w-24"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
              className="border p-2 rounded w-24"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div key={p.id} className="border rounded p-4">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="font-semibold mt-2">{p.name}</h2>
                <p className="text-gray-600">{p.brand}</p>
                <p className="font-bold">₹{p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p>No products match your filters.</p>}
      </div>
    </ProtectedRoute>
  );
}