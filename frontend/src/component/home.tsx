"use client";

import { useEffect, useState } from 'react';
import api from '../lib/axiosClient';
import notificationService from '../lib/notificationService';
import { NOTIFICATION_TYPES } from '../lib/pusherConfig';

interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
}

export default function BuyerHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(!!localStorage.getItem('token'));
    
    (async () => {
      try {
        const res = await api.get('/api/product/all');
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setProducts(list);
      } catch (e: any) {
        setError(e?.response?.data?.message || '');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = async (productId: number) => {
    setBusyId(productId);
    try {
      await api.post('/api/cart', { productId, quantity: 1 });
      alert('Added to cart');
      
      // Send notification
      await notificationService.sendLocalNotification(
        'Item Added to Cart',
        `Successfully added item to your cart`,
        NOTIFICATION_TYPES.CART_REMINDER,
        { productId, quantity: 1 }
      );
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || 'Failed to add to cart';
      
      // Check if it's an authentication error
      if (e?.response?.status === 401 && e?.response?.data?.requiresAuth) {
        const shouldLogin = confirm('Please login to add items to cart. Would you like to go to the login page?');
        if (shouldLogin) {
          window.location.href = '/buyers/login';
        }
      } else {
        alert(errorMessage);
      }
    } finally {
      setBusyId(null);
    }
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const present = await api.get(`/api/wishlist/check/${productId}`);
      if (present.data === true) {
        await api.delete(`/api/wishlist/product/${productId}`);
        alert('Removed from wishlist');
        
        // Send notification
        await notificationService.sendLocalNotification(
          'Item Removed from Wishlist',
          'The item has been removed from your wishlist',
          NOTIFICATION_TYPES.WISHLIST_ITEM,
          { productId, action: 'removed' }
        );
      } else {
        await api.post('/api/wishlist', { productId });
        alert('Added to wishlist');
        
        // Send notification
        await notificationService.sendLocalNotification(
          'Item Added to Wishlist',
          'The item has been added to your wishlist',
          NOTIFICATION_TYPES.WISHLIST_ITEM,
          { productId, action: 'added' }
        );
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || 'Wishlist action failed';
      
      // Check if it's an authentication error
      if (e?.response?.status === 401) {
        const shouldLogin = confirm('Please login to manage your wishlist. Would you like to go to the login page?');
        if (shouldLogin) {
          window.location.href = '/buyers/login';
        }
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* Hero Banner */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to SocialCommerce
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            Your Ultimate Shopping Destination
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing products, connect with trusted sellers, and enjoy a seamless shopping experience in our vibrant marketplace
          </p>
        </div>
      </section>

      {/* Login Prompt Banner */}
      {!isAuthenticated && (
        <section className="py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Login Required for Shopping</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Please login to add items to your cart, manage your wishlist, and place orders.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/buyers/login" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </a>
                <a 
                  href="/buyers/register" 
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products (uses backend if available; otherwise shows placeholders) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Handpicked items just for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real products from backend */}
            {!loading && products.length > 0 ? (
              products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg className="h-16 w-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{p.description || 'Amazing product from our marketplace'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">${Number(p.price).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => addToCart(p.id)} disabled={!p.inStock || busyId===p.id} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">Add</button>
                        <button onClick={() => toggleWishlist(p.id)} className="bg-white border px-3 py-2 rounded-lg">❤</button>
                        <a href={`/buyers/products/${p.id}/reviews`} className="text-sm text-blue-600 hover:underline">Reviews</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products available</div>
                <p className="text-gray-400">Create some products in your backend to see them here!</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SocialCommerce?
            </h2>
            <p className="text-gray-600">
              Experience the future of online shopping
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your data and transactions are protected with industry-leading security</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly with our efficient logistics network</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600">24/7 support to help you with any questions or concerns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
