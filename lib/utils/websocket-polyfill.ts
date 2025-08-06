// WebSocket polyfill for Next.js compatibility
// This ensures that WebSocket operations work correctly in both server and client environments

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Polyfill for bufferutil.mask if not available
if (!isBrowser && typeof global !== 'undefined') {
  try {
    // Try to import the native bufferutil
    const bufferUtil = require('bufferutil');
    
    // If bufferUtil doesn't have mask function, provide a fallback
    if (!bufferUtil.mask) {
      bufferUtil.mask = function(source: Buffer, mask: Buffer, output: Buffer, offset: number, length: number) {
        for (let i = 0; i < length; i++) {
          output[offset + i] = source[i] ^ mask[i % 4];
        }
      };
    }
    
    if (!bufferUtil.unmask) {
      bufferUtil.unmask = function(buffer: Buffer, mask: Buffer) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] ^= mask[i % 4];
        }
      };
    }
  } catch (error) {
    console.warn('Native bufferutil not available, using polyfill');
    
    // If bufferutil is not available, create a minimal polyfill
    const bufferUtilPolyfill = {
      mask: function(source: Buffer, mask: Buffer, output: Buffer, offset: number, length: number) {
        for (let i = 0; i < length; i++) {
          output[offset + i] = source[i] ^ mask[i % 4];
        }
      },
      unmask: function(buffer: Buffer, mask: Buffer) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] ^= mask[i % 4];
        }
      }
    };
    
    // Make it available globally and through module system
    (global as any).bufferUtil = bufferUtilPolyfill;
    
    // Also try to make it available through require
    try {
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      Module.prototype.require = function(id: string) {
        if (id === 'bufferutil') {
          return bufferUtilPolyfill;
        }
        return originalRequire.apply(this, arguments);
      };
    } catch (e) {
      // Ignore if we can't override require
    }
  }

  // Similar polyfill for utf-8-validate
  try {
    const utf8Validate = require('utf-8-validate');
  } catch (error) {
    console.warn('Native utf-8-validate not available, using polyfill');
    
    const utf8ValidatePolyfill = function(buffer: Buffer) {
      // Simple UTF-8 validation polyfill
      try {
        buffer.toString('utf8');
        return true;
      } catch (e) {
        return false;
      }
    };
    
    (global as any).utf8Validate = utf8ValidatePolyfill;
    
    try {
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      Module.prototype.require = function(id: string) {
        if (id === 'utf-8-validate') {
          return utf8ValidatePolyfill;
        }
        return originalRequire.apply(this, arguments);
      };
    } catch (e) {
      // Ignore if we can't override require
    }
  }
}

// Export for use in other parts of the application
export const ensureWebSocketCompatibility = () => {
  // This function can be called to ensure WebSocket compatibility is set up
  if (!isBrowser) {
    // Server-side setup is already done above
    console.log('WebSocket compatibility ensured for server-side');
    return true;
  }
  
  // Client-side doesn't typically need these polyfills
  return true;
};
