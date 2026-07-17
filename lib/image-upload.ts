export type ImageMime = 'image/png' | 'image/jpeg' | 'image/webp';

export const MAX_IMAGE_FILE_SIZE = 8 * 1024 * 1024;
export const MAX_IMAGE_REQUEST_SIZE = MAX_IMAGE_FILE_SIZE + 512 * 1024;
export const MAX_IMAGE_DIMENSION = 12_000;
export const MAX_IMAGE_PIXELS = 40_000_000;

export function detectImageType(bytes: Uint8Array): ImageMime | null {
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= png.length && png.every((value, index) => bytes[index] === value)) {
    return 'image/png';
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    bytes.length >= 12 &&
    new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
    new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export function validateImageGeometry(metadata: { width?: number; height?: number }) {
  const { width, height } = metadata;
  if (!width || !height || !Number.isInteger(width) || !Number.isInteger(height)) return false;
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) return false;
  return width * height <= MAX_IMAGE_PIXELS;
}
