import { NextRequest, NextResponse } from 'next/server';
import { atimeusServerService, ProjectIndicatorsDto } from '@/lib/services/server/atimeus';
import { ProjectFinancialSummaryDto } from '@/lib/interfaces/apis';

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


/**
 * Sanitize data to ensure JSON serializability
 */
function sanitizeForJson(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'number') {
    // Handle NaN, Infinity, -Infinity
    if (!isFinite(obj)) {
      console.warn('Non-finite number found:', obj);
      return 0;
    }
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    console.warn('BigInt found, converting to string:', obj);
    return obj.toString();
  }
  
  if (typeof obj === 'string' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForJson(item));
  }
  
  if (typeof obj === 'object') {
    // Handle circular references and other problematic objects
    try {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip functions and symbols
        if (typeof value === 'function' || typeof value === 'symbol') {
          console.warn(`Skipping non-serializable property "${key}":`, typeof value);
          continue;
        }
        
        // Try to serialize each field individually
        try {
          const sanitizedValue = sanitizeForJson(value);
          // Test if this specific value can be JSON serialized
          JSON.stringify(sanitizedValue);
          sanitized[key] = sanitizedValue;
        } catch (fieldError) {
          console.error(`Field "${key}" failed sanitization:`, fieldError, typeof value);
          // Convert problematic values to string representation
          sanitized[key] = String(value);
        }
      }
      return sanitized;
    } catch (e) {
      console.error('Object processing failed:', e);
      // If there's any issue with the object, return a safe representation
      return String(obj);
    }
  }
  
  // Handle any other types
  console.warn('Unknown type found:', typeof obj, obj);
  return String(obj);
}

/**
 * GET /api/v1/projects/atimeus/[projectId]
 * Get project details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    
    // Await params before accessing properties
    const resolvedParams = await params;
    const { projectId } = resolvedParams;
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    const data: ProjectFinancialSummaryDto = await atimeusServerService.getProjectIndicators(token, projectId);
    
    console.log('Raw data received:', typeof data, data ? Object.keys(data) : 'data is null/undefined');
    console.log('Data value:', data);
    
    if (!data) {
      console.error('No data received from atimeusServerService.getProjectIndicators');
      return NextResponse.json(
        { error: 'No project data found' },
        { status: 404 }
      );
    }
    
    // Sanitize the data to ensure JSON serializability
    const sanitizedData = sanitizeForJson(data);
    
    console.log('Sanitized data keys:', Object.keys(sanitizedData));
    
    // Test JSON serialization before returning
    try {
      const jsonString = JSON.stringify(sanitizedData);
      console.log('JSON serialization successful, string length:', jsonString.length);
    } catch (jsonError) {
      console.error('JSON serialization failed for sanitized data:', jsonError);
      console.error('Problematic data keys:', Object.keys(sanitizedData));
      
      // Try to find the specific problematic field
      for (const [key, value] of Object.entries(sanitizedData)) {
        try {
          JSON.stringify(value);
        } catch (fieldError) {
          console.error(`Field "${key}" is not serializable:`, fieldError, typeof value, value);
        }
      }
      
      throw new Error('Data serialization failed');
    }
    
    return NextResponse.json(sanitizedData);
  } catch (error: any) {
    const resolvedParams = await params;
    console.error(`GET /api/v1/projects/atimeus/${resolvedParams.projectId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: error.status || 500 }
    );
  }
}
 