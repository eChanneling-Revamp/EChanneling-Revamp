import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getUserSession } from '@/lib/auth';
import { ApiResponse } from '@/types/api';

/**
 * GET /api/auth/protected
 * Example protected route that requires authentication
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Check authentication
    await requireAuth(request);

    // Get user session
    const session = await getUserSession(request);

    return NextResponse.json({
      success: true,
      data: {
        message: 'This is a protected route',
        user: {
          id: session?.userId,
          email: session?.email,
          role: session?.role,
          name: session?.name,
        },
        timestamp: new Date().toISOString(),
      },
      message: 'Protected route accessed successfully',
    });

  } catch (error: any) {
    console.error('Protected route API error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to access protected route',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/auth/protected
 * Example protected route with POST method
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Check authentication
    await requireAuth(request);

    // Get user session
    const session = await getUserSession(request);
    const body = await request.json();

    return NextResponse.json({
      success: true,
      data: {
        message: 'POST request to protected route successful',
        user: {
          id: session?.userId,
          email: session?.email,
          role: session?.role,
          name: session?.name,
        },
        requestData: body,
        timestamp: new Date().toISOString(),
      },
      message: 'Protected POST route accessed successfully',
    });

  } catch (error: any) {
    console.error('Protected POST route API error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to access protected route',
      message: error.message,
    }, { status: 500 });
  }
}
