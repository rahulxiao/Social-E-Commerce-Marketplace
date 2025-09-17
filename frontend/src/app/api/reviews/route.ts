import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// POST /api/reviews -> create review
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const res = await axios.post('http://localhost:3333/reviews', body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to create review' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/reviews/my-reviews -> list my reviews
export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const res = await axios.get('http://localhost:3333/reviews/my-reviews', {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load reviews' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





