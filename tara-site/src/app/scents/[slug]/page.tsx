import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScentDetailPage } from "@/components/pages/ScentDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/content/brand";
import { scents } from "@/content/scents";
import { getScentBySlug } from "@/lib/catalog";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return scents.map((scent) => ({
    slug: scent.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scent = getScentBySlug(slug);

  if (!scent) {
    return {
      title: "Scent",
    };
  }

  const pageUrl = absoluteUrl(`/scents/${scent.slug}`);
  const socialImage = scent.editorial ? {
    url: absoluteUrl(scent.editorial.src), width: scent.editorial.width, height: scent.editorial.height, alt: scent.editorial.alt,
  } : {
    url: absoluteUrl(`/og/tara-${scent.slug}.jpg`),
    width: 1200,
    height: 630,
    alt: `${scent.name} by TARA - ${scent.tagline}.`,
  };
  const socialTitle = `${scent.name} - ${scent.tagline}`;

  return {
    title: scent.seo ? { absolute: scent.seo.title } : `${scent.name} - Luxury Perfume`,
    description: scent.seo?.description ?? scent.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: socialTitle,
      description: scent.seo?.description ?? scent.summary,
      url: pageUrl,
      siteName: brand.name,
      images: [socialImage],
      locale: "en_MY",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: scent.seo?.description ?? scent.summary,
      images: [socialImage],
    },
  };
}

export default async function ScentPage({ params }: PageProps) {
  const { slug } = await params;
  const scent = getScentBySlug(slug);

  if (!scent) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildProductJsonLd(scent),
          buildBreadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Scents", href: "/scents" },
            { name: scent.name, href: `/scents/${scent.slug}` },
          ]),
        ]}
      />
      <ScentDetailPage scent={scent} />
    </>
  );
}
