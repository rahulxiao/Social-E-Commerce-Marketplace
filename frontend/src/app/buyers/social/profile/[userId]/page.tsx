'use client';

import { useEffect, useState } from 'react';
import api from '../../../../../lib/axiosClient';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  address?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function SocialProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError('');
    try {
      const res = await api.get(`/api/social/profile/${userId}`);
      setProfile(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [userId]);

  const follow = async () => {
    if (!profile) return;
    setBusy(true);
    try {
      await api.post('/api/social', { followingId: Number(userId) });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to follow');
    } finally {
      setBusy(false);
    }
  };
  const unfollow = async () => {
    setBusy(true);
    try {
      await api.delete(`/api/social/unfollow/${userId}`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to unfollow');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-gray-900 font-semibold">{profile.fullName}</div>
              <div className="text-sm text-gray-600">{profile.email}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-700">
            <div>Followers: <span className="font-semibold">{profile.followersCount}</span></div>
            <div>Following: <span className="font-semibold">{profile.followingCount}</span></div>
          </div>
          <div className="mt-6">
            {profile.isFollowing ? (
              <button onClick={unfollow} disabled={busy} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Unfollow</button>
            ) : (
              <button onClick={follow} disabled={busy} className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Follow</button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href={`/api/social/followers/${userId}`} className="text-blue-600 underline text-sm">Followers API</a>
          <a href={`/api/social/following/${userId}`} className="text-blue-600 underline text-sm">Following API</a>
        </div>
      </div>
    </div>
  );
}





