import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// PUT /api/cart/item/:itemId -> PUT /cart/item/:itemId
export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { itemId } = await params;
    const body = await request.json();
    const res = await axios.put(`http://localhost:3333/cart/item/${itemId}`, body, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to update item' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/cart/item/:itemId -> DELETE /cart/item/:itemId
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { itemId } = await params;
    const res = await axios.delete(`http://localhost:3333/cart/item/${itemId}`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to remove item' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


