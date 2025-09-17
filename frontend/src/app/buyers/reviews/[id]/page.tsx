'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/axiosClient';

interface ReviewDetail {
  id: number;
  rating: number;
  comment?: string;
  product: { id: number; title: string };
  createdAt: string;
}

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  const load = async () => {
    setError('');
    try {
      const res = await api.get(`/api/reviews/${id}`);
      setReview(res.data);
      setForm({ rating: res.data.rating, comment: res.data.comment || '' });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load review');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/reviews/${id}`, { rating: form.rating, comment: form.comment || undefined });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update review');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      window.location.href = '/buyers/reviews';
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!review) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <a href="/buyers/reviews" className="text-blue-600 hover:underline">← Back to My Reviews</a>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-6">Edit Review</h1>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="mb-4 text-gray-900 font-semibold">{review.product.title}</div>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm(v => ({ ...v, rating: Math.min(5, Math.max(1, parseInt(e.target.value || '1', 10))) }))}
                className="w-24 px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comment (optional)</label>
              <input
                type="text"
                value={form.comment}
                onChange={(e) => setForm(v => ({ ...v, comment: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl border-gray-300 hover:border-gray-400"
                placeholder="Write your thoughts"
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={remove} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
              <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}





