import { NextRequest, NextResponse } from 'next/server';
import { dynDataCrudServerService } from '@/lib/services/server/dyn_data/dynDataCrud.server.service';

/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const size = searchParams.get('size') ? Number(searchParams.get('size')) : undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' || undefined;

    const params = {
      page,
      size,
      sortBy,
      sortDirection
    };

    console.log('Data Records API: GET request with params:', params);

    const data = await dynDataCrudServerService.getDataRecords(token, params);

    return NextResponse.json({
      success: true,
      data,
      message: 'Data records retrieved successfully'
    });

  } catch (error) {
    console.error('Data Records API: GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to retrieve data records'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Data Records API: POST request with body:', body);

    const data = await dynDataCrudServerService.createDataRecord(token, body);

    return NextResponse.json({
      success: true,
      data,
      message: 'Data record created successfully'
    });

  } catch (error) {
    console.error('Data Records API: POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create data record'
      },
      { status: 500 }
    );
  }
}
