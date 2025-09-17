import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get('http://localhost:3333/buyer/me', {
      headers: { Authorization: authHeader },
      timeout: 15000,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({ message: error.response.data?.message || 'Failed to fetch profile' }, { status: error.response.status || 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





