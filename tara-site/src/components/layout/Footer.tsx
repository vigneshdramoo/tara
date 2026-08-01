import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { brand } from "@/content/brand";
import { legalPages } from "@/content/legal";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[rgba(247,243,235,0.72)]">
      <Container className="grid gap-10 py-14 lg:grid-cols-[0.9fr_0.45fr_1.15fr]">
        <div className="space-y-5">
          <div className="flex items-center">
            <Image
              src="/logos/tara-wordmark.png"
              alt={`${brand.name} wordmark with Illuminate the Unseen tagline`}
              width={2400}
              height={656}
              className="h-auto w-[260px] object-contain sm:w-[320px]"
            />
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--color-copy)]">
            Dark editorial fragrance for women and men who want luxury to feel
            intimate, magnetic, and impossible to imitate.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-y border-black/10 py-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/64">
              <SiteIcon name="shield" className="h-4 w-4 text-[var(--color-gold)]" />
              <span>100% authentic</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/64">
              <SiteIcon name="lock" className="h-4 w-4 text-[var(--color-gold)]" />
              <span>Secure checkout</span>
            </div>
          </div>
          <SocialLinks links={brand.socialLinks} variant="inline" />
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Explore
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-black/68">
              {brand.footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition duration-300 hover:text-[var(--color-gold)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Trust
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-black/68">
              {legalPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="transition duration-300 hover:text-[var(--color-gold)]"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-y border-black/10 py-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            {brand.newsletter.title}
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--color-copy)]">
            {brand.newsletter.body}
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <Container className="border-t border-black/8 py-5 text-xs uppercase tracking-[0.24em] text-black/42">
        <div className="flex flex-col gap-3">
          <p>(c) {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p>Registered in Malaysia · SSM No. 202603110736</p>
        </div>
      </Container>
    </footer>
  );
}
