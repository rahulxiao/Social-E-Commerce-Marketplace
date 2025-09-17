import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    const backendFormData = new FormData();
    // Optional fields; backend DTO: fullName?, phone?, email?, address?
    const keys = ['fullName', 'phone', 'email', 'address'] as const;
    keys.forEach((key) => {
      const v = formData.get(key);
      if (v !== null && v !== undefined && v !== '') backendFormData.append(key, v as string);
    });

    const avatar = formData.get('avatar') as File | null;
    if (avatar) backendFormData.append('avatar', avatar);

    const response = await axios.put('http://localhost:3333/buyer/profile', backendFormData, {
      headers: {
        Authorization: authHeader,
      },
      timeout: 20000,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({ message: error.response.data?.message || 'Failed to update profile' }, { status: error.response.status || 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





