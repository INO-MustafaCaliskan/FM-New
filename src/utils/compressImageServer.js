"use server"

import sharp from "sharp";

const IMAGE_FORMATS = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Dosya buffer'ından format belirle
 * HEIC/HEIF ve bilinmeyenler JPEG'e zorlanır
 */
const resolveOutputFormat = (format) => {
  if (format === "heic" || format === "heif") return "jpeg";
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  return "jpeg";
};

/**
 * Resize yapılması gerekip gerekmediğini kontrol et
 */
const calculateResizedDimensions = (origW, origH, maxWidth, maxHeight) => {
  const exceedsWidth = maxWidth !== undefined && origW > maxWidth;
  const exceedsHeight = maxHeight !== undefined && origH > maxHeight;

  if (!exceedsWidth && !exceedsHeight) {
    return null;
  }

  const aspectRatio = origW / origH;
  let width = origW;
  let height = origH;

  if (exceedsWidth) {
    width = maxWidth;
    height = Math.round(width / aspectRatio);
  }

  if (exceedsHeight && height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  return { width, height };
};

/**
 * Resimi sunucu tarafında sıkıştırır ve resize eder
 * @param {Buffer} fileBuffer - Dosya buffer'ı
 * @param {Object} options - { maxWidth?: number, maxHeight?: number, compress?: number (0-100) }
 * @returns {Promise<{ buffer: Buffer, mimeType: string, width: number, height: number }>}
 *
 * @example
 * const result = await compressImageServer(buffer, { maxWidth: 1200, maxHeight: 1200, compress: 80 });
 */
export async function compressImageServer(fileBuffer, options = {}) {
  const { maxWidth, maxHeight, compress = 80 } = options;

  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Dosya buffer'ı boş");
    }

    // Metadata al
    const metadata = await sharp(fileBuffer).metadata();

    // SVG desteklenmiyor, olduğu gibi döndür
    if (metadata?.format === "svg") {
        return {
            buffer: fileBuffer,
            mimeType: "image/svg+xml",
            width: metadata.width,
            height: metadata.height,
            originalWidth: metadata.width,
            originalHeight: metadata.height,
            originalFormat: "svg",
        };
    }
    const { width: origW, height: origH, format: origFormat } = metadata;

    if (!origW || !origH) {
      throw new Error("Resim boyutları alınamadı");
    }

    // Output formatı belirle
    const outputFormat = resolveOutputFormat(metadata.format);
    const mimeType = IMAGE_FORMATS[outputFormat] || "image/jpeg";

    // Resize gerekli mi
    const newDimensions = calculateResizedDimensions(
      origW,
      origH,
      maxWidth,
      maxHeight
    );

    const finalWidth = newDimensions?.width || origW;
    const finalHeight = newDimensions?.height || origH;

    // Sharp pipeline
    let pipeline = sharp(fileBuffer).resize(finalWidth, finalHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // Format'a göre compress ayarlarını uygula
    if (outputFormat === "jpeg") {
        pipeline = pipeline.jpeg({ quality: compress });
    } else if (outputFormat === "png") {
        pipeline = pipeline.png({ compressionLevel: Math.round((1 - compress / 100) * 9) });
    } else if (outputFormat === "webp") {
        pipeline = pipeline.webp({ quality: compress });
    }

    const buffer = await pipeline.toBuffer();

    return {
      buffer,
      mimeType,
      width: finalWidth,
      height: finalHeight,
      originalWidth: origW,
      originalHeight: origH,
      originalFormat: origFormat,
    };
  } catch (error) {
    console.error("Server-side image compression failed:", error);
    throw new Error(`Resim sıkıştırması başarısız: ${error.message}`);
  }
}

/**
 * Utility: Bilgi göster (debug için)
 */
export async function getImageInfoServer(fileBuffer) {
  try {
    const compressed = await compressImageServer(fileBuffer, {
      maxWidth: 2000,
      maxHeight: 2000,
      compress: 80,
    });

    return {
      originalSize: (fileBuffer.length / 1024 / 1024).toFixed(2) + " MB",
      compressedSize: (compressed.buffer.length / 1024 / 1024).toFixed(2) + " MB",
      ratio: ((compressed.buffer.length / fileBuffer.length) * 100).toFixed(1) + "%",
      originalDimensions: `${compressed.originalWidth}x${compressed.originalHeight}`,
      newDimensions: `${compressed.width}x${compressed.height}`,
      originalFormat: compressed.originalFormat,
    };
  } catch (error) {
    console.error("Error getting image info:", error);
    throw error;
  }
}


export async function compressAndReturnImage(file, options = {maxWidth: 2000, maxHeight: 2000, compress: 80}) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed =  await compressImageServer(buffer, options);
    const compressedFile = new File([compressed.buffer], file.name, {
      type: compressed.mimeType,
    });
    return compressedFile;
}