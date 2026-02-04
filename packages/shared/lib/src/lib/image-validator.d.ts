/**
 * Common image validation utility for frontend
 */
export declare const MAX_IMAGE_SIZE: number;
export declare const ALLOWED_IMAGE_MIME_TYPES: readonly ["image/png", "image/jpeg", "image/jpg", "image/webp"];
export declare const ALLOWED_IMAGE_EXTENSIONS: readonly ["png", "jpg", "jpeg", "webp"];
export interface ImageValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates an image file
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export declare function validateImageFile(file: File): ImageValidationResult;
/**
 * Gets the accept attribute value for file input
 */
export declare function getImageAcceptAttribute(): string;
//# sourceMappingURL=image-validator.d.ts.map