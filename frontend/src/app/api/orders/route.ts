import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/orders -> list history
export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const res = await axios.get('http://localhost:3333/orders', {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load orders' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders -> create from cart
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const res = await axios.post('http://localhost:3333/orders', body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 20000,
    });
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to create order' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





