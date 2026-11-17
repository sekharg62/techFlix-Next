"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  HelpCircle,
  PackageSearch,
  FileText,
  Package,
  Home,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/context/CartContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { CategorySummary } from "@/types/catalog";

type NavItem = { href: string; label: string; icon: LucideIcon; match: (path: string) => boolean };

const LEFT_LINKS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/products", label: "Products", icon: Package, match: (p) => p.startsWith("/products") || p.startsWith("/product/") },
];
const RIGHT_LINKS: NavItem[] = [
  { href: "/support", label: "Support", icon: HelpCircle, match: (p) => p.startsWith("/support") },
  { href: "/orders", label: "Track Order", icon: PackageSearch, match: (p) => p.startsWith("/orders") },
  { href: "/bill", label: "Get Bill", icon: FileText, match: (p) => p.startsWith("/bill") },
];

/** Red underline that grows from the center on hover and stays visible on the active item. */
function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-[var(--color-brand-red)] origin-center transition-transform duration-300 ease-out ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

function DesktopLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-1.5 py-1 transition-colors ${
        active ? "text-[var(--color-brand-red)]" : "text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)]"
      }`}
    >
      <Icon
        className={`w-4 h-4 transition-colors ${
          active ? "text-[var(--color-brand-red)]" : "text-neutral-500 dark:text-neutral-400 group-hover:text-[var(--color-brand-red)]"
        }`}
      />
      {item.label}
      <Underline active={active} />
    </Link>
  );
}

export function Header({ categories }: { categories: CategorySummary[] }) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHover = useRef(false);
  const { itemCount: cartItemCount } = useCart();

  // Mouse hover opens the dropdown; leaving closes it after a short delay so the
  // cursor can travel from the button into the menu. Touch and keyboard use click.
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelClose();
    if (!isDropdownOpen) openedByHover.current = true;
    setIsDropdownOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = setTimeout(() => setIsDropdownOpen(false), 180);
  };
  // A click right after hover-opening keeps it open instead of toggling it shut.
  const clickToggle = () => {
    cancelClose();
    if (openedByHover.current) {
      openedByHover.current = false;
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen((o) => !o);
    }
  };
  useEffect(() => cancelClose, []);
  useEffect(() => {
    if (!isDropdownOpen) openedByHover.current = false;
  }, [isDropdownOpen]);

  // Close both menus whenever the page changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  // Click outside closes the dropdown; Escape closes everything.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);
  const mobileLink = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md font-bold transition-colors border-l-2 ${
      active
        ? "border-[var(--color-brand-red)] bg-red-50 dark:bg-red-950/30 text-[var(--color-brand-red)]"
        : "border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900"
    }`;

  return (
    <header data-print-hide className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-[var(--card-border)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4 px-4 sm:px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 justify-self-start hover:opacity-90 transition-opacity">
          <Image src="/images/logo-emblem.png" alt="TECH FLIX logo" width={46} height={40} loading="eager" className="h-10 w-auto" />
          <span className="font-display text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            TECH <span className="text-[var(--color-brand-red)]">FLIX</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold">
          {LEFT_LINKS.map((item) => (
            <DesktopLink key={item.href} item={item} active={item.match(pathname)} />
          ))}

          {/* Categories dropdown: opens on hover (mouse) or click (touch / keyboard) */}
          <div className="relative" ref={dropdownRef} onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
            <button
              type="button"
              onClick={clickToggle}
              className={`group relative flex items-center gap-1.5 py-1 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]/50 rounded-sm ${
                isDropdownOpen ? "text-[var(--color-brand-red)]" : "text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)]"
              }`}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-controls="categories-menu"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180 text-[var(--color-brand-red)]" : "text-neutral-500 dark:text-neutral-400 group-hover:text-[var(--color-brand-red)]"
                }`}
              />
              <Underline active={isDropdownOpen} />
            </button>

            {/* Always mounted so it can animate both in and out */}
            <div
              id="categories-menu"
              inert={!isDropdownOpen}
              className={`absolute left-1/2 top-full mt-4 w-72 -translate-x-1/2 origin-top rounded-lg bg-white dark:bg-neutral-900 border border-[var(--card-border)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-2 z-50 transition-all duration-200 ease-out ${
                isDropdownOpen ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
              }`}
            >
              {/* Invisible bridge over the gap so the hover isn't lost on the way down */}
              <span aria-hidden="true" className="absolute -top-5 inset-x-0 h-5" />
              {/* Small pointer arrow */}
              <span aria-hidden="true" className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-neutral-900 border-l border-t border-[var(--card-border)]" />
              <div className="relative px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-[var(--card-border)] mb-1">
                Browse Categories
              </div>
              <div className="relative flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ transitionDelay: isDropdownOpen ? `${i * 25}ms` : "0ms" }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group ${
                      isDropdownOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon slug={cat.slug} name={cat.name} />
                      <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-[var(--color-brand-red)] transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-[var(--color-brand-red)] group-hover:text-white transition-colors">
                      {cat.totalProducts}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {RIGHT_LINKS.map((item) => (
            <DesktopLink key={item.href} item={item} active={item.match(pathname)} />
          ))}
        </nav>

        {/* Right Section: Cart Icon, Theme Toggle & Mobile Toggle */}
        <div className="flex items-center gap-3 justify-self-end">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-all"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--color-brand-red)] text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-md">
                {cartItemCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* Mobile Menu Toggle: icons cross-fade and rotate */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="lg:hidden relative w-11 h-11 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:border-[var(--color-brand-red)] transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className={`absolute inset-0 m-auto w-5 h-5 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
            <X className={`absolute inset-0 m-auto w-5 h-5 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu: dimmed backdrop + panel that slides down (always mounted so it animates both ways) */}
      <div
        aria-hidden="true"
        onClick={closeMobile}
        className={`lg:hidden absolute inset-x-0 top-full h-screen bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        id="mobile-menu"
        inert={!isMobileMenuOpen}
        className={`lg:hidden absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-300 ease-out ${
          isMobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile"
            className={`max-h-[calc(100svh-80px)] overflow-y-auto bg-white dark:bg-neutral-950 border-b border-[var(--card-border)] shadow-2xl px-4 pt-3 pb-6 space-y-3 text-neutral-900 dark:text-neutral-100 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
          >
            {LEFT_LINKS.map(({ href, label, icon: Icon, match }) => (
              <Link key={href} href={href} onClick={closeMobile} aria-current={match(pathname) ? "page" : undefined} className={mobileLink(match(pathname))}>
                <Icon className="w-5 h-5 text-[var(--color-brand-red)]" />
                {label}
              </Link>
            ))}

            <Link href="/cart" onClick={closeMobile} className={`${mobileLink(pathname.startsWith("/cart"))} justify-between`}>
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[var(--color-brand-red)]" />
                Cart
              </span>
              {cartItemCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-[var(--color-brand-red)] text-white text-xs font-bold">{cartItemCount} items</span>
              )}
            </Link>

            <div className="space-y-1 pt-2 border-t border-[var(--card-border)]">
              <div className="px-3 text-xs font-bold text-neutral-400 uppercase tracking-wider py-1">Categories</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={closeMobile}
                    className="flex items-center gap-2 p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:border-[var(--color-brand-red)] border border-transparent transition-all"
                  >
                    <CategoryIcon slug={cat.slug} name={cat.name} />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--card-border)] space-y-1">
              {RIGHT_LINKS.map(({ href, label, icon: Icon, match }) => (
                <Link key={href} href={href} onClick={closeMobile} aria-current={match(pathname) ? "page" : undefined} className={mobileLink(match(pathname))}>
                  <Icon className="w-5 h-5 text-[var(--color-brand-red)]" />
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
