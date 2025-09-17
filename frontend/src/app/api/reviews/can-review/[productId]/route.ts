import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { productId } = await params;
    const res = await axios.get(`http://localhost:3333/reviews/can-review/${productId}`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to check review permission' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


