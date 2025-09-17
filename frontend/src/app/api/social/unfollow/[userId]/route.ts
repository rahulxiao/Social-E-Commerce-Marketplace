import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { userId } = await params;
    const res = await axios.delete(`http://localhost:3333/social/unfollow/${userId}`, {
      headers: { Authorization: auth },
      timeout: 15000,
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || 'Failed to unfollow user' }, { status: error.response.status || 400 });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


