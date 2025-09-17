import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    console.log('API route called - Content-Type:', request.headers.get('content-type'));
    
    const formData = await request.formData();
    
    // Debug: Log the data being sent
    console.log('Raw formData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value, typeof value);
      }
    }
    
    // Create a new FormData object for the backend
    const backendFormData = new FormData();
    backendFormData.append('fullName', formData.get('fullName') as string);
    backendFormData.append('email', formData.get('email') as string);
    backendFormData.append('password', formData.get('password') as string);
    backendFormData.append('confirmPassword', formData.get('confirmPassword') as string);
    backendFormData.append('phone', formData.get('phone') as string);
    
    const file = formData.get('file') as File;
    if (file) {
      backendFormData.append('file', file);
    }
    
    // Debug: Log what we're sending to backend
    console.log('Sending to backend:');
    for (let [key, value] of backendFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value, typeof value);
      }
    }
    
    // Forward the FormData to the backend (use auth signup so password is hashed)
    const response = await axios.post('http://localhost:3333/auth/buyer/signup', backendFormData, {
      timeout: 30000, // Increased timeout for file uploads
    });

    // Debug: Log response details
    console.log('Backend response status:', response.status);
    console.log('Backend response data:', response.data);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error('Buyer registration proxy error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle axios error response
    if (error.response) {
      console.error('Backend response status:', error.response.status);
      console.error('Backend response data:', error.response.data);
      
      return NextResponse.json(
        { 
          message: error.response.data?.message || 'Registration failed', 
          details: error.response.data,
          error: 'Backend validation failed'
        },
        { status: error.response.status }
      );
    }
    
    // Handle connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { 
          message: 'Backend server is not running or not accessible',
          details: { code: error.code, message: error.message },
          error: 'Connection failed'
        },
        { status: 503 }
      );
    }
    
    // Handle any other errors
    return NextResponse.json(
      { 
        message: 'Internal server error',
        details: { 
          code: error.code, 
          message: error.message,
          name: error.name
        },
        error: 'API route error'
      },
      { status: 500 }
    );
  }
}
