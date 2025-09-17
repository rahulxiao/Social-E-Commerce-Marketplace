import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const response = await axios.post('http://localhost:3333/auth/buyer/login', {
      email,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    const accessToken = (response.data as any)?.access_token;
    return NextResponse.json({ token: accessToken }, { status: 200 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({ message: error.response.data?.message || 'Login failed' }, { status: error.response.status || 400 });
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json({ message: 'Backend server is unavailable' }, { status: 503 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
