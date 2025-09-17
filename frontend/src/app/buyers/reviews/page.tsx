'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';

interface ReviewItem {
  id: number;
  rating: number;
  comment?: string;
  product: { id: number; title: string; category: string };
  createdAt: string;
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/reviews');
        const list = Array.isArray(res.data?.reviews) ? res.data.reviews : res.data; // supports both shapes
        setReviews(list || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Reviews</h1>
        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">No reviews yet.</div>
            )}
            {reviews.map(r => (
              <a key={r.id} href={`/buyers/reviews/${r.id}`} className="block bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-semibold">{r.product.title}</div>
                    <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">{r.rating}★</div>
                  </div>
                </div>
                {r.comment && <div className="mt-2 text-gray-700">{r.comment}</div>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





