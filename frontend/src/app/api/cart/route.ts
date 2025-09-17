import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/cart -> GET /cart
export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const res = await axios.get('http://localhost:3333/cart', {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load cart' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cart/add -> POST /cart/add
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    const body = await request.json();
    
    // If no auth token, return a helpful message
    if (!auth) {
      return NextResponse.json({ 
        message: 'Please login to add items to cart',
        requiresAuth: true 
      }, { status: 401 });
    }
    
    const res = await axios.post('http://localhost:3333/cart/add', body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to add to cart' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





