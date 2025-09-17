import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/reviews/product/:productId -> list reviews with pagination
export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    const { productId } = await params;
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    const headers: any = { 'Content-Type': 'application/json' };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const res = await axios.get(`http://localhost:3333/reviews/product/${productId}?page=${page}&limit=${limit}`, { 
      headers,
      timeout: 15000 
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load product reviews' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


