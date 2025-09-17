'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';

interface OrderItem {
  id: number;
  quantity: number;
  totalPrice: number;
  productTitle: string;
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/orders');
        const list = Array.isArray(res.data?.orders) ? res.data.orders : res.data; // supports both shapes
        setOrders(list || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Orders</h1>
        {loading && <div className="text-gray-600">Loading orders...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-6">
            {orders.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">No orders yet.</div>
            )}
            {orders.map((o) => (
              <a key={o.id} href={`/buyers/orders/${o.id}`} className="block bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-semibold">{o.orderNumber}</div>
                    <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()} • {o.totalItems} items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">${Number(o.totalAmount).toFixed(2)}</div>
                    <div className="text-sm uppercase">{o.status}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





