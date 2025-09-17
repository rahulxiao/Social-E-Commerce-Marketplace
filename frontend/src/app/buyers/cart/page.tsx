'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axiosClient';
import notificationService from '../../../lib/notificationService';
import { NOTIFICATION_TYPES } from '../../../lib/pusherConfig';

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { id: number; title: string; price: number; stock: number; inStock: boolean };
}

interface CartResponse {
  id: number;
  totalAmount: number;
  totalItems: number;
  isActive: boolean;
  cartItems: CartItem[];
}

const validateQuantity = (q: number): string | null => {
  if (!Number.isInteger(q) || q < 1 || q > 100) return 'Quantity must be between 1 and 100';
  return null;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  const loadCart = async () => {
    setError('');
    try {
      const res = await api.get('/api/cart');
      setCart(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const updateQuantity = async (itemId: number, quantity: number) => {
    const err = validateQuantity(quantity);
    if (err) { alert(err); return; }
    setBusyItemId(itemId);
    try {
      const res = await api.put(`/api/cart/item/${itemId}`, { quantity });
      setCart(res.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update item');
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!confirm('Remove this item from cart?')) return;
    setBusyItemId(itemId);
    try {
      const res = await api.delete(`/api/cart/item/${itemId}`);
      setCart(res.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to remove item');
    } finally {
      setBusyItemId(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear entire cart?')) return;
    setClearing(true);
    try {
      await api.delete('/api/cart/clear');
      await loadCart();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to clear cart');
    } finally {
      setClearing(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    const err = validateQuantity(quantity);
    if (err) { alert(err); return; }
    try {
      const res = await api.post('/api/cart', { productId, quantity });
      setCart(res.data);
      
      // Send notification
      await notificationService.sendLocalNotification(
        'Item Added to Cart',
        `Successfully added ${quantity} item(s) to your cart`,
        NOTIFICATION_TYPES.CART_REMINDER,
        { productId, quantity }
      );
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Cart</h1>

        {loading && <div className="text-gray-600">Loading cart...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && cart && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {cart.cartItems.length === 0 ? (
                <div className="text-gray-600">Your cart is empty.</div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="font-semibold text-gray-900">{item.product.title}</div>
                        <div className="text-sm text-gray-600">Unit: ${Number(item.unitPrice).toFixed(2)} | In stock: {item.product.stock}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          defaultValue={item.quantity}
                          onChange={(e) => {
                            const q = parseInt(e.target.value || '1', 10);
                            if (Number.isNaN(q)) return;
                            updateQuantity(item.id, q);
                          }}
                          className="w-20 px-3 py-2 border rounded-lg"
                          disabled={busyItemId === item.id}
                        />
                        <div className="w-24 text-right font-semibold">${Number(item.totalPrice).toFixed(2)}</div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={busyItemId === item.id}
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="text-gray-700">Items: <span className="font-semibold">{cart.totalItems}</span></div>
              <div className="text-gray-900">Total: <span className="font-bold text-blue-600">${Number(cart.totalAmount).toFixed(2)}</span></div>
              <div className="flex items-center gap-3">
                <button onClick={clearCart} disabled={clearing} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Clear Cart</button>
                <a href="/buyers/checkout" className="px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600">Checkout</a>
              </div>
            </div>

            {/* Example add-to-cart quick test */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="text-sm text-gray-600 mb-2">Quick add (for testing)</div>
              <div className="flex items-center gap-3">
                <input id="pid" type="number" placeholder="Product ID" className="px-3 py-2 border rounded-lg" />
                <input id="pqty" type="number" placeholder="Qty" defaultValue={1} className="px-3 py-2 border rounded-lg w-24" />
                <button
                  onClick={() => {
                    const pidEl = document.getElementById('pid') as HTMLInputElement | null;
                    const qtyEl = document.getElementById('pqty') as HTMLInputElement | null;
                    const pid = parseInt(pidEl?.value || '0', 10);
                    const qty = parseInt(qtyEl?.value || '1', 10);
                    if (!pid) { alert('Enter product id'); return; }
                    addToCart(pid, qty);
                  }}
                  className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                >Add to Cart</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





