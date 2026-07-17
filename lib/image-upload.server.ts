import sharp from 'sharp';
import {
  detectImageType,
  MAX_IMAGE_PIXELS,
  MAX_IMAGE_REQUEST_SIZE,
  validateImageGeometry,
  type ImageMime,
} from '@/lib/image-upload';

export type ImageValidationResult =
  | { ok: true; mimeType: ImageMime; width: number; height: number }
  | { ok: false; code: 'invalid_image_signature' | 'invalid_image_data' };

export async function validateImageBytes(
  bytes: Uint8Array,
  declaredType: string,
): Promise<ImageValidationResult> {
  const detectedType = detectImageType(bytes);
  if (!detectedType || detectedType !== declaredType) {
    return { ok: false, code: 'invalid_image_signature' };
  }

  try {
    const image = sharp(bytes, {
      failOn: 'warning',
      limitInputPixels: MAX_IMAGE_PIXELS,
    });
    const metadata = await image.metadata();
    const decodedType = metadata.format === 'jpg' ? 'jpeg' : metadata.format;
    if (`image/${decodedType}` !== detectedType || !validateImageGeometry(metadata)) {
      return { ok: false, code: 'invalid_image_data' };
    }
    if ((metadata.pages ?? 1) !== 1) {
      return { ok: false, code: 'invalid_image_data' };
    }
    await image.stats();
    return {
      ok: true,
      mimeType: detectedType,
      width: metadata.width!,
      height: metadata.height!,
    };
  } catch {
    return { ok: false, code: 'invalid_image_data' };
  }
}

export async function readBoundedRequestBody(request: Request, limit = MAX_IMAGE_REQUEST_SIZE) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > limit) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}
