/**
 * Common image validation utility for frontend
 */

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'] as const;

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an image file
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'File is required',
    };
  }

  // Validate MIME type
  const normalizedMimeType = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(normalizedMimeType as any)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed types: PNG, JPG, JPEG, WEBP',
    };
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of 5MB. File size: ${fileSizeMB}MB`,
    };
  }

  // Optional: Validate file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension && !ALLOWED_IMAGE_EXTENSIONS.includes(extension as any)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Gets the accept attribute value for file input
 */
export function getImageAcceptAttribute(): string {
  return ALLOWED_IMAGE_MIME_TYPES.join(',');
}

