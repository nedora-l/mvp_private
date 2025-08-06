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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const { id } = params;
    console.log('Data Record Details API: GET request for ID:', id);

    const data = await dynDataCrudServerService.getDataRecordDetails(token, id);

    return NextResponse.json({
      success: true,
      data,
      message: 'Data record retrieved successfully'
    });

  } catch (error) {
    console.error('Data Record Details API: GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to retrieve data record'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    console.log('Data Record Details API: PUT request for ID:', id, 'with body:', body);

    const data = await dynDataCrudServerService.updateDataRecord(token, id, body);

    return NextResponse.json({
      success: true,
      data,
      message: 'Data record updated successfully'
    });

  } catch (error) {
    console.error('Data Record Details API: PUT error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to update data record'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const { id } = params;
    console.log('Data Record Details API: DELETE request for ID:', id);

    const result = await dynDataCrudServerService.deleteDataRecord(token, id);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Data record deleted successfully'
    });

  } catch (error) {
    console.error('Data Record Details API: DELETE error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to delete data record'
      },
      { status: 500 }
    );
  }
}
