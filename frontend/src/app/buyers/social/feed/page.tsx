'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/axiosClient';

interface Activity {
  id: number;
  type: string;
  description: string;
  buyer: { id: number; fullName: string };
  createdAt: string;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get(`/api/social?page=${page}&limit=20`);
      const newItems = res.data?.activities || [];
      setActivities(prev => page === 1 ? newItems : [...prev, ...newItems]);
      setHasMore(res.data?.hasMore ?? newItems.length > 0);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Activity Feed</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="space-y-4">
          {activities.map(a => (
            <div key={a.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{a.buyer.fullName}</div>
                <div className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm uppercase text-gray-500 mt-1">{a.type}</div>
              <div className="mt-2 text-gray-800">{a.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
          <div className="text-sm">Page {page}</div>
          <button onClick={() => setPage(p => hasMore ? p + 1 : p)} disabled={!hasMore} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
        </div>
        {loading && <div className="mt-3 text-gray-600">Loading...</div>}
      </div>
    </div>
  );
}





