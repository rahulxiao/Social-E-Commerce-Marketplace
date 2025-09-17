import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/orders/:id -> get order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const res = await axios.get(`http://localhost:3333/orders/${id}`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load order' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/orders/:id/status -> update status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { id } = await params;
    const res = await axios.put(`http://localhost:3333/orders/${id}/status`, body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to update status' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/orders/:id/cancel -> cancel order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const res = await axios.delete(`http://localhost:3333/orders/${id}/cancel`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to cancel order' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


