import { useEffect, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallBackSrc: string;
  fallBackClassName?: string;
  [key: string]: any;
}

export default function ImageWithFallback({
  src,
  alt,
  fallBackSrc,
  fallBackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      src={error ? fallBackSrc : src}
      alt={alt}
      onError={(e: any) => setError(e)}
      {...props}
      className={error ? fallBackClassName : props.className}
    />
  );
}
