"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  Menu, 
  X, 
  HelpCircle,
  PackageSearch,
  FileText,
  Package,
  Home,
  ShoppingBag
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/context/CartContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { CategorySummary } from "@/types/catalog";

export function Header({ categories }: { categories: CategorySummary[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { itemCount: cartItemCount } = useCart();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header data-print-hide className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-[var(--card-border)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/images/logo-emblem.png" alt="TECH FLIX logo" width={46} height={40} loading="eager" className="h-10 w-auto" />
          <span className="font-display text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            TECH <span className="text-[var(--color-brand-red)]">FLIX</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold">
          {/* Home */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <Home className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Home
          </Link>

          {/* Products */}
          <Link 
            href="/products" 
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <Package className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Products
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1 focus:outline-none cursor-pointer"
              aria-expanded={isDropdownOpen}
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[var(--color-brand-red)]" : "text-neutral-500 dark:text-neutral-400"}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-neutral-900 border border-[var(--card-border)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-xs font-bold text-neutral-400 dark:text-neutral-400 uppercase tracking-wider border-b border-[var(--card-border)] mb-1">
                  Browse Categories
                </div>
                <div className="flex flex-col gap-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <CategoryIcon slug={cat.slug} name={cat.name} />
                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-[var(--color-brand-red)] dark:group-hover:text-[var(--color-brand-red)] transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-[var(--color-brand-red)] group-hover:text-white dark:group-hover:text-white transition-colors">
                        {cat.totalProducts}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Support */}
          <Link 
            href="/support" 
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <HelpCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Support
          </Link>

          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <PackageSearch className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Track Order
          </Link>

          <Link
            href="/bill"
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Get Bill
          </Link>
        </nav>

        {/* Right Section: Cart Icon, Theme Toggle & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Shopping Cart Icon Button */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-all"
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

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:opacity-80 transition-opacity"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-neutral-950 border-b border-[var(--card-border)] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 text-neutral-900 dark:text-neutral-100">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Home className="w-5 h-5 text-[var(--color-brand-red)]" />
            Home
          </Link>

          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Package className="w-5 h-5 text-[var(--color-brand-red)]" />
            Products
          </Link>

          <Link
            href="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[var(--color-brand-red)]" />
              Cart
            </div>
            {cartItemCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-brand-red)] text-white text-xs font-bold">
                {cartItemCount} items
              </span>
            )}
          </Link>

          {/* Categories Accordion on Mobile */}
          <div className="space-y-1 pt-2 border-t border-[var(--card-border)]">
            <div className="px-3 text-xs font-bold text-neutral-400 dark:text-neutral-400 uppercase tracking-wider py-1">
              Categories
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:border-[var(--color-brand-red)] border border-transparent transition-all"
                >
                  <CategoryIcon slug={cat.slug} name={cat.name} />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--card-border)]">
            <Link
              href="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <HelpCircle className="w-5 h-5 text-[var(--color-brand-red)]" />
              Support
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <PackageSearch className="w-5 h-5 text-[var(--color-brand-red)]" />
              Track Order
            </Link>
            <Link
              href="/bill"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <FileText className="w-5 h-5 text-[var(--color-brand-red)]" />
              Get Bill
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
