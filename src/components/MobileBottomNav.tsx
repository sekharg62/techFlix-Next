"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingBag, Search, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartContext = useCart();
  const cartItemCount = cartContext?.cart?.length || 0;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="w-5 h-5" />,
      active: pathname === "/",
    },
    {
      label: "Product",
      href: "/products",
      icon: <Package className="w-5 h-5" />,
      active: pathname === "/products",
    },
    {
      label: "Cart",
      href: "/cart",
      icon: (
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[var(--color-brand-red)] text-white text-[9px] font-black flex items-center justify-center shadow-md">
              {cartItemCount}
            </span>
          )}
        </div>
      ),
      active: pathname === "/cart",
    },
    {
      label: "Search",
      href: "/products?focus=search",
      icon: <Search className="w-5 h-5" />,
      active: pathname.includes("search"),
    },
    {
      label: "Support",
      href: "/support",
      icon: <Menu className="w-5 h-5" />,
      active: pathname === "/support",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-t border-[var(--card-border)] px-2 py-2 shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              item.active
                ? "text-[var(--color-brand-red)] font-bold scale-105"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
