import Image, { type ImageProps } from "next/image";

import { getCloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary";

interface RecipeImageProps extends Omit<ImageProps, "src"> {
  imageUrl: string;
  cloudinaryWidth?: number;
  cloudinaryHeight?: number;
}

export function RecipeImage({
  imageUrl,
  cloudinaryWidth,
  cloudinaryHeight,
  alt,
  ...props
}: RecipeImageProps) {
  const src = getCloudinaryUrl(imageUrl, {
    width: cloudinaryWidth,
    height: cloudinaryHeight,
    crop: "limit",
  });

  return (
    <Image
      {...props}
      alt={alt}
      src={src}
      unoptimized={isCloudinaryUrl(src)}
    />
  );
}
