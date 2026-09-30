"use client";

import { preload } from "react-dom";
import type { VisualAsset } from "@/types/content";

// Next's globally unoptimized static export suppresses even custom-loader srcsets.
// Supply native responsive markup backed by the prebuilt, uncropped WebP files.
export function ScentImage({
  asset,
  mobileAsset,
  sizes,
  priority = false,
  className,
}: {
  asset: VisualAsset;
  mobileAsset?: VisualAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const srcSet = asset.responsiveWidths
    ?.map(
      (width) => `${asset.src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`,
    )
    .join(", ");
  if (priority)
    preload(asset.src, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  return (
    <picture>
      {mobileAsset ? (
        <source
          media="(max-width: 767px)"
          width={mobileAsset.width}
          height={mobileAsset.height}
          sizes={sizes}
          srcSet={
            mobileAsset.responsiveWidths
              ?.map(
                (width) =>
                  `${mobileAsset.src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`,
              )
              .join(", ") ?? mobileAsset.src
          }
        />
      ) : null}
      <img
        src={asset.src}
        srcSet={srcSet}
        sizes={sizes}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
