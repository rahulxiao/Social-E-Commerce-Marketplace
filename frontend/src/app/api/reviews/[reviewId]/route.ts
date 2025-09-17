import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/reviews/:reviewId
export async function GET(_request: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const { reviewId } = await params;
    const res = await axios.get(`http://localhost:3333/reviews/${reviewId}`, { timeout: 15000 });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load review' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/reviews/:reviewId
export async function PUT(request: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { reviewId } = await params;
    const res = await axios.put(`http://localhost:3333/reviews/${reviewId}`, body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to update review' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/reviews/:reviewId
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { reviewId } = await params;
    const res = await axios.delete(`http://localhost:3333/reviews/${reviewId}`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to delete review' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


