"use client";

import Image from "next/image";
import { type HTMLAttributes, type ImgHTMLAttributes, useState } from "react";
import LazyLoad from "react-lazyload";
import { Skeleton } from "~/components/ui/skeleton";

interface TProps {
  src: string;
  alt: string;
  height: number;
  width: number;
  skeletonClass?: HTMLAttributes<HTMLDivElement>;
  ImageClass?: ImgHTMLAttributes<HTMLImageElement>;
}

function LazyImage({
  src,
  alt,
  height,
  width,
  skeletonClass,
  ImageClass,
}: TProps) {
  const [loading, setLoading] = useState(true);

  return (
    <LazyLoad className="w-full">
      {loading && (
        <div className="flex flex-col space-y-3">
          <Skeleton className={`rounded-xl ${skeletonClass?.className}`} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }}
        height={height}
        width={width}
        className={`${ImageClass?.className}`}
      />
    </LazyLoad>
  );
}

export default LazyImage;
