import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const url = new URL(_request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const { userId } = await params;
    const res = await axios.get(`http://localhost:3333/social/followers/${userId}?page=${page}&limit=${limit}`, { timeout: 15000 });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to load followers' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


