import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/constants/siteConfig";
import { ShieldCheck, Clock, Wallet, Headphones, Phone, type LucideIcon } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import type { CategorySummary } from "@/types/catalog";

const HIGHLIGHTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Genuine Products", text: "100% verified subscriptions" },
  { icon: Clock, title: "5–10 Min Delivery", text: "Usually after payment check" },
  { icon: Wallet, title: "Easy Payment", text: "bKash, Nagad & Rocket" },
  { icon: Headphones, title: "Real Support", text: "WhatsApp, 9 AM to midnight" },
];

const HELP_LINKS = [
  { href: "/#faq", label: "FAQ" },
  { href: "/support", label: "Contact Support" },
  { href: "/orders", label: "Track Order" },
  { href: "/bill", label: "Get Bill" },
];

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/warranty-refund", label: "Warranty & Refund Policy" },
];

const PAYMENTS = [
  { src: "/images/bkash.png", alt: "bKash" },
  { src: "/images/nagad.png", alt: "Nagad" },
  { src: "/images/rocket.png", alt: "Rocket" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block text-neutral-600 dark:text-neutral-300 hover:text-[var(--color-brand-red)] hover:translate-x-1 transition-all duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="relative font-black text-sm uppercase tracking-wider text-neutral-900 dark:text-white mb-5 pb-2">
      {children}
      <span aria-hidden="true" className="absolute left-0 bottom-0 w-8 h-0.5 rounded-full bg-[var(--color-brand-red)]" />
    </h3>
  );
}

/** Gmail "M" mark in a single color (inherits currentColor). */
function GmailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="52 42 88 66" className={className} fill="currentColor" aria-hidden="true">
      <path d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      <path d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      <path d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      <path d="M72 74V48l24 18 24-18v26L96 92" />
      <path d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  );
}

const socialClass =
  "w-10 h-10 rounded-md flex items-center justify-center border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-700 dark:text-neutral-200 transition-colors";

export function Footer({ categories = [] }: { categories?: CategorySummary[] }) {
  // Biggest categories first; empty ones would only lead to an empty page.
  const topCategories = categories
    .filter((c) => c.totalProducts > 0)
    .sort((a, b) => b.totalProducts - a.totalProducts)
    .slice(0, 5);

  return (
    <footer
      data-print-hide
      className="relative w-full mt-auto overflow-hidden border-t border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-200 pt-12 pb-28 md:pb-10"
    >
      {/* Thin red glow line along the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-red)]/60 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-full max-w-3xl rounded-full bg-[var(--color-brand-red)]/10 blur-3xl" />

      <div className="relative max-w-site mx-auto px-4 sm:px-6">
        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden border border-[var(--card-border)] bg-[var(--card-border)] mb-12">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 p-4 sm:p-5 bg-[var(--card-bg)]">
              <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-950/50 text-[var(--color-brand-red)]">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold leading-tight">{title}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-x-6 gap-y-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <Image src="/images/logo-emblem.png" alt="TECH FLIX logo" width={41} height={36} className="h-9 w-auto" />
              <span className="font-display text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                TECH <span className="text-[var(--color-brand-red)]">FLIX</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Premium digital subscriptions at the best price.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5 max-w-sm">
              Your trusted marketplace for verified AI tools, streaming, design and software subscriptions in Bangladesh.
            </p>
            <div className="flex items-center gap-2.5">
              {siteConfig.whatsapp && (
                <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`${socialClass} hover:bg-[#25D366] hover:border-[#25D366] hover:text-white`}>
                  <WhatsAppIcon className="w-[18px] h-[18px]" />
                </a>
              )}
              {siteConfig.facebook && (
                <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${socialClass} hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white`}>
                  <FaFacebook className="w-4 h-4" />
                </a>
              )}
              {siteConfig.instagram && (
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${socialClass} hover:bg-[#E1306C] hover:border-[#E1306C] hover:text-white`}>
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <ColumnTitle>Shop</ColumnTitle>
            <ul className="space-y-3 text-sm font-semibold">
              <FooterLink href="/products">All Products</FooterLink>
              {topCategories.map((c) => (
                <FooterLink key={c.slug} href={`/products?category=${encodeURIComponent(c.slug)}`}>
                  {c.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Help + Legal */}
          <div>
            <ColumnTitle>Help</ColumnTitle>
            <ul className="space-y-3 text-sm font-semibold">
              {HELP_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
            <div className="mt-8">
              <ColumnTitle>Legal</ColumnTitle>
              <ul className="space-y-3 text-sm font-semibold">
                {LEGAL_LINKS.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <ColumnTitle>Get in touch</ColumnTitle>
            <div className="space-y-3 text-sm">
              {siteConfig.whatsapp && (
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 rounded-md border border-[var(--card-border)] hover:border-[#25D366]/60 transition-colors"
                >
                  <span className="w-9 h-9 rounded-md flex items-center justify-center bg-[#25D366]/15 text-[#25D366] shrink-0">
                    <WhatsAppIcon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-neutral-500">WhatsApp (9 AM – midnight)</span>
                    <span className="block font-bold group-hover:text-[#25D366] transition-colors">{siteConfig.phone}</span>
                  </span>
                </a>
              )}
              <a
                href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                className="group flex items-center gap-3 p-3 rounded-md border border-[var(--card-border)] hover:border-blue-500/60 transition-colors"
              >
                <span className="w-9 h-9 rounded-md flex items-center justify-center bg-blue-500/15 text-blue-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-neutral-500">Call us</span>
                  <span className="block font-bold group-hover:text-blue-500 transition-colors">{siteConfig.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-3 p-3 rounded-md border border-[var(--card-border)] hover:border-[#EA4335]/60 transition-colors"
              >
                <span className="w-9 h-9 rounded-md flex items-center justify-center bg-[#EA4335]/15 text-[#EA4335] shrink-0">
                  <GmailIcon className="w-[18px] h-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-neutral-500">Email</span>
                  <span className="block font-bold truncate group-hover:text-[#EA4335] transition-colors">{siteConfig.email}</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-5 pt-6 border-t border-[var(--card-border)]">
          <p className="text-xs font-semibold text-neutral-500 text-center md:text-left">
            © {new Date().getFullYear()} TECH FLIX. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-500">We accept</span>
            {PAYMENTS.map((p) => (
              <span key={p.alt} className="h-9 px-2.5 rounded-md bg-white flex items-center justify-center border border-[var(--card-border)]">
                <Image src={p.src} alt={p.alt} width={48} height={28} className="h-6 w-auto object-contain" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
