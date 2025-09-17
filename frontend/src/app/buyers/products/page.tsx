'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';

interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);

  const load = async () => {
    setError('');
    try {
      const res = await api.get('/api/product/all');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setProducts(list);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const addToCart = async (productId: number) => {
    setBusy(productId);
    try {
      await api.post('/api/cart', { productId, quantity: 1 });
      alert('Added to cart');
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setBusy(null);
    }
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const present = await api.get(`/api/wishlist/check/${productId}`);
      if (present.data === true) {
        await api.delete(`/api/wishlist/product/${productId}`);
        alert('Removed from wishlist');
      } else {
        await api.post('/api/wishlist', { productId });
        alert('Added to wishlist');
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Wishlist action failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Products</h1>
        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="text-gray-900 font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.category}</div>
                <div className="mt-2 text-blue-600 font-bold">${Number(p.price).toFixed(2)}</div>
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={() => addToCart(p.id)} disabled={!p.inStock || busy===p.id} className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Add to Cart</button>
                  <button onClick={() => toggleWishlist(p.id)} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Wishlist</button>
                  <a href={`/buyers/products/${p.id}/reviews`} className="text-sm text-blue-600 hover:underline">Reviews</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



