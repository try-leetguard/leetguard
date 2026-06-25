"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const OPTIMIZED_WIDTHS = [640, 1024, 1536, 2048] as const;

type OptimizedImageName = "demo-hero" | "demo-feature" | "login-demo";

type ProgressiveImageProps = {
  name: OptimizedImageName;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

function srcSetFor(name: OptimizedImageName, format: "avif" | "webp" | "jpg") {
  return OPTIMIZED_WIDTHS.map(
    (width) => `/optimized/${name}-${width}.${format} ${width}w`
  ).join(", ");
}

export default function ProgressiveImage({
  name,
  alt,
  width,
  height,
  sizes,
  className,
  imageClassName,
  loading = "lazy",
  fetchPriority = "auto",
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageReady = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      handleImageReady();
    }
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100 text-transparent",
        className
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <img
        aria-hidden="true"
        alt=""
        src={`/optimized/${name}-placeholder.webp`}
        className={cn(
          "absolute inset-0 h-full w-full scale-[1.02] object-cover blur-xl transition-opacity duration-500",
          imageClassName,
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />
      <picture>
        <source type="image/avif" srcSet={srcSetFor(name, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSetFor(name, "webp")} sizes={sizes} />
        <img
          ref={imageRef}
          src={`/optimized/${name}-1024.jpg`}
          srcSet={srcSetFor(name, "jpg")}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={handleImageReady}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700 ease-out",
            imageClassName,
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </picture>
    </div>
  );
}
