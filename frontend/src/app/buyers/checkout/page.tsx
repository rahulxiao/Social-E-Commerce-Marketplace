'use client';

import { useState } from 'react';
import api from '../../../lib/axiosClient';
import notificationService from '../../../lib/notificationService';
import { NOTIFICATION_TYPES } from '../../../lib/pusherConfig';

const validateAddress = (s: string) => s && s.trim().length > 0 ? null : 'Shipping address is required';

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const addrErr = validateAddress(shippingAddress);
    if (addrErr) { setError(addrErr); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/orders', { shippingAddress, notes });
      const orderId = res.data?.id || res.data?.orderNumber;
      setSuccess(`Order created: ${orderId || 'success'}`);
      
      // Send notification
      await notificationService.sendLocalNotification(
        'Order Placed Successfully!',
        `Your order ${orderId} has been placed and is being processed`,
        NOTIFICATION_TYPES.ORDER_UPDATE,
        { orderId }
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Checkout</h1>
        {error && <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl">{error}</div>}
        {success && <div className="mb-4 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl">{success}</div>}
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 hover:border-gray-400"
              placeholder="Enter full shipping address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 hover:border-gray-400"
              placeholder="Any special instructions"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}





