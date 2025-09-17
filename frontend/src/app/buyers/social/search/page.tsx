'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/axiosClient';

export default function SocialSearchPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/social/search?q=${encodeURIComponent(q)}&page=${page}&limit=20`);
      setResults(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (q) search(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Search Users</h1>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className="flex-1 px-4 py-3 border rounded-xl" />
            <button onClick={() => { setPage(1); search(); }} className="px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700">Search</button>
          </div>
          {error && <div className="mt-4 text-red-600">{error}</div>}
          {loading && <div className="mt-4 text-gray-600">Loading...</div>}
          {!loading && results.length > 0 && (
            <div className="mt-4 space-y-3">
              {results.map((u: any) => (
                <a key={u.id} href={`/buyers/social/profile/${u.id}`} className="block border rounded-xl p-3 hover:bg-gray-50">
                  <div className="font-semibold text-gray-900">{u.fullName}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </a>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Prev</button>
                <div className="text-sm">Page {page}</div>
                <button onClick={() => setPage(p => p + 1)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





