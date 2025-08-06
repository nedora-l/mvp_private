import { type NextRequest, NextResponse } from "next/server"
import { FileDto, UpdateFileRequestDto } from "@/lib/interfaces/apis/files";
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { filesServerService } from "@/lib/services/server/files/files.server.service";
import { getSession, useSession } from "next-auth/react";

/**
 * Validate if URL is a valid Google Cloud Storage URL
 */
function isValidGcsUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    // Check if it's a valid GCS URL (storage.googleapis.com or storage.cloud.google.com)
    return parsedUrl.hostname === 'storage.googleapis.com' || 
           parsedUrl.hostname === 'storage.cloud.google.com' ||
           parsedUrl.hostname.endsWith('.storage.googleapis.com');
  } catch {
    return false;
  }
}

/**
 * Infer content type from file extension
 */
function inferContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'ts': 'application/typescript',
    'csv': 'text/csv',
    'md': 'text/markdown',
    'yaml': 'application/x-yaml',
    'stream': 'application/octet-stream',
  };
  
  return mimeTypes[ext || ''] || 'application/pdf'; 
}

/**
 * Get content disposition header based on file type
 */
function getContentDisposition(contentType: string, filename: string): string {
  // For certain file types, display inline (PDFs, images, text files)
  const inlineTypes = [
    'application/pdf',
    'image/',
    'text/',
    'application/json',
    'application/xml'
  ];
  
  const shouldDisplayInline = inlineTypes.some(type => contentType.startsWith(type));
  
  if (shouldDisplayInline) {
    // For PDFs, use inline to show in browser
    if (contentType === 'application/pdf') {
      return `inline; filename="${encodeURIComponent(filename)}"`;
    }
    return `inline; filename="${encodeURIComponent(filename)}"`;
  }
  
  return `attachment; filename="${encodeURIComponent(filename)}"`;
}

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
 * Get file by ID
 * GET /api/v1/files/{id}/download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const token = request.cookies.get('app-auth-token')?.value || extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const fileData: FileDto = await filesServerService.getFileById(token, resolvedParams.id);
    if ((fileData?.downloadUrl  || "").length  > 10 )  {
      // If the file is public, stream the file content instead of redirecting
      console.log("Streaming file content for ID:", resolvedParams.id);
      console.log("File public URL:", fileData.downloadUrl);
      try {
        // Validate the URL format and ensure it's a Google Cloud Storage URL
        const publicUrl = fileData.downloadUrl;
        if (!publicUrl || !isValidGcsUrl(publicUrl)) {
          return NextResponse.json(
            { 
              status: 400,
              message: "Invalid file URL",
              data: null,
              type: "ERROR"
            }, 
            { status: 400 }
          );
        }

        // Fetch the file content from the signed URL
        const fileResponse = await fetch(publicUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'DAWS-FileService/1.0',
          },
        });

        if (!fileResponse.ok) {
          // Handle expired URLs or other fetch errors
          if (fileResponse.status === 403) {
            return NextResponse.json(
              { 
                status: 403,
                message: "File URL has expired or access denied",
                data: null,
                type: "ERROR"
              }, 
              { status: 403 }
            );
          }
          
          return NextResponse.json(
            { 
              status: 502,
              message: "Failed to fetch file content",
              data: null,
              type: "ERROR"
            }, 
            { status: 502 }
          );
        }

        // Get content type from the response or infer from file extension
        const originalContentType = fileResponse.headers.get('content-type') || 
                                   inferContentType(fileData.originalFilename || '');
        const contentType = originalContentType;
        
        console.log("File details:", {
          filename: fileData.originalFilename,
          originalContentType,
          finalContentType: contentType,
          contentLength: fileResponse.headers.get('content-length'),
        });
        
        // Determine content disposition based on file type
        const disposition = getContentDisposition(contentType, fileData.originalFilename || '');
        
        console.log("Content disposition:", disposition);
        
        // Create response headers
        const headers = new Headers({
          'Content-Type': contentType,
          'Content-Disposition': disposition,
          'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
          'X-Content-Type-Options': 'nosniff',
          'Accept-Ranges': 'bytes',
        });

        // Add content length if available
        const contentLength = fileResponse.headers.get('content-length');
        if (contentLength) {
          headers.set('Content-Length', contentLength);
        }

        // Add ETag if available for caching
        const etag = fileResponse.headers.get('etag');
        if (etag) {
          headers.set('ETag', etag);
        }

        // Stream the file content
        const body = fileResponse.body;
        if (!body) {
          return NextResponse.json(
            { 
              status: 502,
              message: "Empty file content",
              data: null,
              type: "ERROR"
            }, 
            { status: 502 }
          );
        }

        console.log("Returning file response with headers:", Object.fromEntries(headers.entries()));

        return new NextResponse(body, {
          status: 200,
          headers,
        });

      } catch (error) {
        console.error("Error streaming file content:", error);
        return NextResponse.json(
          { 
            status: 500,
            message: "Failed to stream file content",
            data: null,
            type: "ERROR"
          }, 
          { status: 500 }
        );
      }
    }
    const response: ApiResponse<FileDto> = {
      status: 200,
      message: "Success",
      data: fileData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get file by ID error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}
 