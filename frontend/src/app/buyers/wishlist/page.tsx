'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';

interface WishlistItem {
  id: number;
  notes?: string;
  product: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    inStock: boolean;
    seller: { id: number; name: string };
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    setError('');
    try {
      const res = await api.get('/api/wishlist');
      setItems(res.data?.items || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const updateNotes = async (itemId: number, notes: string) => {
    setBusyId(itemId);
    try {
      const res = await api.put(`/api/wishlist/item/${itemId}`, { notes });
      // Replace updated item
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, notes: res.data?.notes ?? notes } : i));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update notes');
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!confirm('Remove this item from wishlist?')) return;
    setBusyId(itemId);
    try {
      await api.delete(`/api/wishlist/item/${itemId}`);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to remove item');
    } finally {
      setBusyId(null);
    }
  };

  const clearAll = async () => {
    if (!confirm('Clear entire wishlist?')) return;
    setClearing(true);
    try {
      await api.delete('/api/wishlist/clear');
      setItems([]);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to clear wishlist');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Wishlist</h1>
        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={clearAll} disabled={clearing} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Clear Wishlist</button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {items.length === 0 ? (
                <div className="text-gray-600">Your wishlist is empty.</div>
              ) : (
                <div className="space-y-4">
                  {items.map(it => (
                    <div key={it.id} className="flex items-start justify-between border-b pb-4">
                      <div className="pr-4">
                        <div className="text-gray-900 font-semibold">{it.product.title}</div>
                        <div className="text-sm text-gray-600">Seller: {it.product.seller.name}</div>
                        <div className="text-sm text-gray-600">${Number(it.product.price).toFixed(2)} • {it.product.category}</div>
                        <a href={`/buyers/products/${it.product.id}/reviews`} className="text-blue-600 text-sm hover:underline">View reviews</a>
                      </div>
                      <div className="w-80">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                        <input
                          type="text"
                          defaultValue={it.notes || ''}
                          onBlur={(e) => updateNotes(it.id, e.target.value)}
                          disabled={busyId === it.id}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Add a note..."
                        />
                        <div className="mt-3 flex justify-end">
                          <button onClick={() => removeItem(it.id)} disabled={busyId === it.id} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





