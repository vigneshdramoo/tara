import type { Metadata } from "next";

import { brand } from "@/content/brand";
import { absoluteUrl } from "@/lib/utils";

type SocialImage = {
  path: string;
  alt: string;
  width?: number;
  height?: number;
};

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  socialImage: SocialImage;
  robots?: Metadata["robots"];
};

export function buildPageMetadata({
  title,
  description,
  path,
  socialTitle,
  socialImage,
  robots,
}: BuildPageMetadataOptions): Metadata {
  const pageUrl = absoluteUrl(path);
  const resolvedSocialTitle = socialTitle ?? `${title} | ${brand.name}`;
  const resolvedSocialImage = {
    url: absoluteUrl(socialImage.path),
    alt: socialImage.alt,
    width: socialImage.width,
    height: socialImage.height,
  };

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    ...(robots ? { robots } : {}),
    openGraph: {
      title: resolvedSocialTitle,
      description,
      url: pageUrl,
      siteName: brand.name,
      images: [resolvedSocialImage],
      locale: "en_MY",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedSocialTitle,
      description,
      images: [resolvedSocialImage],
    },
  };
}
