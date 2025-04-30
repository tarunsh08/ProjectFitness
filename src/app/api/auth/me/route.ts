import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Define the expected shape of your JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role?: string; // Add other user properties as needed
}

export async function GET(req: Request) {
  try {
    // 1. Extract token from cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token missing' },
        { status: 401 }
      );
    }

    // 2. Verify token with proper type checking
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. Return minimal necessary user data
    const userData = {
      id: decoded.id,
      email: decoded.email,
      ...(decoded.role && { role: decoded.role }) // Only include if exists
    };

    return NextResponse.json(
      { success: true, user: userData },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Token verification error:', error);

    // 4. Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please login again.' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, error: 'Invalid session. Please login again.' },
        { status: 401 }
      );
    }

    // 5. Handle unexpected errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error instanceof Error ? error.message : 'Unknown error' 
        })
      },
      { status: 401 }
    );
  }
}