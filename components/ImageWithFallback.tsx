import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallBackSrc: string;
  [key: string]: any;
}

export default function ImageWithFallback({
  src,
  alt,
  fallBackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Image
      src={imageError ? fallBackSrc : src}
      alt={alt}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}
