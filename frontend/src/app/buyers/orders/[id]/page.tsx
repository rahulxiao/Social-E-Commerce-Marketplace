'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/axiosClient';

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productTitle: string;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  shippingAddress?: string;
  notes?: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setError('');
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const cancelOrder = async () => {
    if (!confirm('Cancel this order?')) return;
    setUpdating(true);
    try {
      await api.delete(`/api/orders/${id}`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <a href="/buyers/orders" className="text-blue-600 hover:underline">← Back to Orders</a>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-6">Order {order.orderNumber}</h1>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-700">Status</div>
              <div className="text-lg font-semibold">{order.status}</div>
            </div>
            <div>
              <div className="text-gray-700">Total</div>
              <div className="text-lg font-bold text-blue-600">${Number(order.totalAmount).toFixed(2)}</div>
            </div>
            <div>
              <button onClick={cancelOrder} disabled={updating} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">Cancel Order</button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Items: {order.totalItems}</div>
          {order.shippingAddress && <div className="mt-1 text-sm text-gray-600">Ship to: {order.shippingAddress}</div>}
          {order.notes && <div className="mt-1 text-sm text-gray-600">Notes: {order.notes}</div>}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="font-semibold text-gray-900 mb-4">Items</div>
          <div className="space-y-3">
            {order.orderItems.map(it => (
              <div key={it.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="text-gray-900">{it.productTitle}</div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                </div>
                <div className="font-semibold">${Number(it.totalPrice).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





