"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  PlayCircle, 
  ChevronDown, 
  Menu, 
  X, 
  Bot, 
  Video, 
  Palette, 
  PenTool, 
  Shield, 
  Tv, 
  AppWindow,
  HelpCircle,
  Package,
  Home,
  ShoppingBag
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CATEGORIES } from "@/constants/productsData";
import { useCart } from "@/context/CartContext";

const categoryIconMap: Record<string, React.ReactNode> = {
  "ai-tools": <Bot className="w-4 h-4 text-purple-500" />,
  "video-editing": <Video className="w-4 h-4 text-red-500" />,
  "design-tools": <Palette className="w-4 h-4 text-pink-500" />,
  "writing-tools": <PenTool className="w-4 h-4 text-emerald-500" />,
  "vpn-security": <Shield className="w-4 h-4 text-blue-500" />,
  "streaming": <Tv className="w-4 h-4 text-amber-500" />,
  "microsoft": <AppWindow className="w-4 h-4 text-sky-500" />,
};

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const cartContext = useCart();
  const cartItemCount = cartContext?.cart?.length || 0;

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-[var(--card-border)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <PlayCircle className="w-8 h-8 text-[var(--color-brand-red)] animate-pulse" />
          <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
            TECH<span className="text-[var(--color-brand-red)]">FLIX</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
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
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        {categoryIconMap[cat.slug] || <Package className="w-4 h-4" />}
                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-[var(--color-brand-red)] dark:group-hover:text-[var(--color-brand-red)] transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-[var(--color-brand-red)] group-hover:text-white dark:group-hover:text-white transition-colors">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help & Support */}
          <Link 
            href="/support" 
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:text-[var(--color-brand-red)] dark:hover:text-[var(--color-brand-red)] transition-colors py-1"
          >
            <HelpCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            Help & Support
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
            className="md:hidden p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:opacity-80 transition-opacity"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-950 border-b border-[var(--card-border)] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 text-neutral-900 dark:text-neutral-100">
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
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:border-[var(--color-brand-red)] border border-transparent transition-all"
                >
                  {categoryIconMap[cat.slug]}
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
              Help & Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
