'use client';

import { useEffect, useState, use } from 'react';
import api from '../../../../../lib/axiosClient';

interface ReviewItem {
  id: number;
  rating: number;
  comment?: string;
  buyer?: { id: number; fullName: string };
  createdAt: string;
}

export default function ProductReviewsPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [canReview, setCanReview] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 5, comment: '', orderId: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const [listRes, statsRes, canRes] = await Promise.all([
        api.get(`/api/reviews/product/${productId}?page=${page}&limit=10`),
        api.get(`/api/reviews/product/${productId}/stats`),
        api.get(`/api/reviews/can-review/${productId}`),
      ]);
      setReviews(listRes.data || []);
      setStats(statsRes.data || null);
      setCanReview(!!canRes.data?.canReview);
      if (Array.isArray(canRes.data?.purchasedOrders) && canRes.data.purchasedOrders.length > 0) {
        setForm(v => ({ ...v, orderId: String(canRes.data.purchasedOrders[0].orderId) }));
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [productId, page]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview) { alert('You cannot review this product.'); return; }
    if (!form.orderId) { alert('Missing order to verify purchase.'); return; }
    setSaving(true);
    try {
      await api.post('/api/reviews', { rating: form.rating, comment: form.comment || undefined, productId: Number(productId), orderId: Number(form.orderId) });
      setForm({ rating: 5, comment: '', orderId: form.orderId });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Product Reviews</h1>
        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-6">
            {stats && (
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <div className="font-semibold text-gray-900">Average: {stats.averageRating}★ ({stats.totalReviews} reviews)</div>
              </div>
            )}

            {canReview && (
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <div className="font-semibold mb-3">Write a review</div>
                <form onSubmit={submit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                    <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm(v => ({ ...v, rating: Math.min(5, Math.max(1, parseInt(e.target.value || '1', 10))) }))} className="w-24 px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Comment (optional)</label>
                    <input type="text" value={form.comment} onChange={(e) => setForm(v => ({ ...v, comment: e.target.value }))} className="w-full px-4 py-3 border rounded-xl border-gray-300 hover:border-gray-400" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50">{saving ? 'Submitting...' : 'Submit Review'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <div className="font-semibold text-gray-900 mb-3">Reviews</div>
              {reviews.length === 0 && <div className="text-gray-600">No reviews yet.</div>}
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border-b pb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{r.buyer?.fullName || 'Anonymous'}</div>
                      <div className="text-yellow-600 font-bold">{r.rating}★</div>
                    </div>
                    {r.comment && <div className="mt-1 text-gray-700">{r.comment}</div>}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Prev</button>
                <div className="text-sm">Page {page}</div>
                <button onClick={() => setPage(p => p + 1)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




