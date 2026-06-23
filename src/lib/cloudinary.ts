export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "scale";
}

function getCloudName(): string | undefined {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  return cloudName || undefined;
}

export function isCloudinaryUrl(url: string) {
  return url.includes("res.cloudinary.com");
}

/**
 * Builds an optimized Cloudinary fetch URL for remote images.
 * Cloudinary already handles format, quality, and resizing — skip Next.js re-optimization.
 */
export function getCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || isCloudinaryUrl(url)) {
    return url;
  }

  const cloudName = getCloudName();
  if (!cloudName) {
    return url;
  }

  const transforms = ["f_auto", "q_auto:good", "fl_progressive"];

  if (options.width) {
    transforms.push(`w_${options.width}`);
  }

  if (options.height) {
    transforms.push(`h_${options.height}`);
  }

  if (options.width || options.height) {
    transforms.push(`c_${options.crop ?? "limit"}`);
  }

  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transforms.join(",")}/${encodeURIComponent(url)}`;
}
