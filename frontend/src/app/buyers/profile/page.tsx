'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';

interface BuyerProfile {
  id: number;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatarUrl?: string | null;
}

interface ValidationErrors {
  [key: string]: string;
}

const validateFullName = (name: string): string | null => {
  if (name && !/^[A-Za-z\s]+$/.test(name)) {
    return 'Full name must only contain letters and spaces.';
  }
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (phone && !/^01\d{9}$/.test(phone)) {
    return 'Phone must start with 01 and be 11 digits.';
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  if (email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export default function BuyerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '' });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/api/buyer/me');
        if (!mounted) return;
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          address: res.data.address || '',
        });
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };

  const validateForm = (): boolean => {
    const vErrors: ValidationErrors = {};
    const n = validateFullName(form.fullName);
    if (n) vErrors.fullName = n;
    const p = validatePhone(form.phone);
    if (p) vErrors.phone = p;
    const em = validateEmail(form.email);
    if (em) vErrors.email = em;
    setErrors(vErrors);
    return Object.keys(vErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!validateForm()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.fullName) fd.append('fullName', form.fullName);
      if (form.phone) fd.append('phone', form.phone);
      if (form.email) fd.append('email', form.email);
      if (form.address) fd.append('address', form.address);
      if (avatar) fd.append('avatar', avatar);
      const res = await api.put('/api/buyer/profile', fd);
      setSuccess('Profile updated successfully');
      setProfile(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Profile</h1>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl">{success}</div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <label htmlFor="avatar" className="inline-flex items-center px-4 py-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 text-sm font-medium text-blue-700 cursor-pointer hover:bg-blue-100">
                  Upload Avatar
                </label>
                <input id="avatar" type="file" className="hidden" onChange={handleFile} />
                <div className="text-sm text-gray-600 mt-2">{avatar ? avatar.name : 'PNG/JPG up to 2MB'}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                placeholder="Your full name"
              />
              {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="01XXXXXXXXX"
                />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl border-gray-300 hover:border-gray-400"
                placeholder="Your address"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}





