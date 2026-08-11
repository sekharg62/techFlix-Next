import Link from "next/link";
import { siteConfig } from "@/constants/siteConfig";
import {
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  Mail,
  Phone,
  PlayCircle
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--card-bg)] border-t border-[var(--card-border)] pt-12 pb-24 md:pb-12 mt-auto text-neutral-800 dark:text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* 4 Value Proposition Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Genuine Products</h4>
              <p className="text-xs text-neutral-500">100% verified keys & passes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Instant Delivery</h4>
              <p className="text-xs text-neutral-500">Automated digital dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Secure Payment</h4>
              <p className="text-xs text-neutral-500">256-bit encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Customer Support</h4>
              <p className="text-xs text-neutral-500">24/7 dedicated assistance</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <PlayCircle className="w-7 h-7 text-[var(--color-brand-red)]" />
              <span className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">
                TECH<span className="text-[var(--color-brand-red)]">FLIX</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-[var(--color-brand-red)] mb-2">
              Premium digital subscriptions at the best price.
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4">
              Your trusted marketplace for verified AI subscriptions, streaming passes, design suites, and official software licenses.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-[var(--color-brand-red)] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-[var(--color-brand-red)] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link href="/" className="hover:text-[var(--color-brand-red)] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[var(--color-brand-red)] transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[var(--color-brand-red)] transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--color-brand-red)] transition-colors">FAQ</Link>
              </li>

              <li>
                <Link href="/support" className="hover:text-[var(--color-brand-red)] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-400 mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link href="/legal/privacy" className="hover:text-[var(--color-brand-red)] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-[var(--color-brand-red)] transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-[var(--color-brand-red)] transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/legal/warranty" className="hover:text-[var(--color-brand-red)] transition-colors">Warranty Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-400 mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm font-semibold mb-4">
              <li>
                <Link href="/support" className="hover:text-[var(--color-brand-red)] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--color-brand-red)] transition-colors">Contact Support</Link>
              </li>
            </ul>
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-[var(--card-border)] space-y-2 text-xs">
              <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-[var(--color-brand-red)]">
                <Phone className="w-3.5 h-3.5 text-[var(--color-brand-red)]" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-[var(--color-brand-red)] truncate">
                <Mail className="w-3.5 h-3.5 text-[var(--color-brand-red)]" />
                {siteConfig.email}
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Footer Line */}
        <div className="w-full text-center text-xs font-semibold text-neutral-500 pt-8 border-t border-[var(--card-border)]">
          <p>© {new Date().getFullYear()} TechFlix. All rights reserved. Premium Digital Subscriptions & Licenses.</p>
        </div>

      </div>
    </footer>
  );
}
