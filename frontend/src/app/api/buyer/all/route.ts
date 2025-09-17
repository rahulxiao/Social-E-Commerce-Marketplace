import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(_request: NextRequest) {
  try {
    const response = await axios.get('http://localhost:3333/buyer/all', { timeout: 15000 });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({ message: error.response.data?.message || 'Failed to load buyers' }, { status: error.response.status || 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





