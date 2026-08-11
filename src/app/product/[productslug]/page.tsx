"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Check, 
  Clock, 
  ArrowLeft 
} from "lucide-react";
import { ALL_PRODUCTS } from "@/constants/productsData";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: Promise<{ productslug: string }> }) {
  const { productslug } = use(params);
  const router = useRouter();
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart || (() => {});

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find product by slug or id
  const product = ALL_PRODUCTS.find(
    (p) => p.slug === productslug || p.id === productslug
  );

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setToastMessage(`${product.name} * ${quantity} added to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    router.push("/checkout");
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <Check className="w-5 h-5 bg-white/20 rounded-full p-0.5" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation: Home > Product > Name of product */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-500 mb-8 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        <Link href="/products" className="hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
          Product
        </Link>
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 dark:text-neutral-100 font-bold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Product Details Section: Image Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left Side: Product Image Showcase */}
        <div className="space-y-4">
          <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden bg-neutral-950 border border-[var(--card-border)] shadow-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {product.badge && (
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--color-brand-red)] text-white shadow-lg">
                {product.badge}
              </div>
            )}

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-6 py-2.5 rounded-full bg-red-600 text-white font-black text-lg tracking-wider shadow-2xl">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Stock Status Tag & Rating */}
            <div className="flex items-center justify-between">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock (Instant Digital Access)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Currently Out of Stock
                </span>
              )}

              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Category Tag */}
            <div className="inline-block px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-[var(--color-brand-red)]">
              Category: {product.category}
            </div>

            {/* Tagline & Full Description */}
            <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-neutral-400 block mb-0.5">Special Deal Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[var(--color-brand-red)]">
                    {product.priceBDT || product.price}
                  </span>
                  {product.originalPriceBDT && (
                    <span className="text-sm font-bold text-neutral-400 line-through">
                      {product.originalPriceBDT}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                Official License
              </span>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Select Quantity:
                </label>
                <div className="inline-flex items-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-extrabold text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now */}
            {product.inStock ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="py-4 px-6 rounded-2xl border-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-extrabold text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="py-4 px-6 rounded-2xl bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold text-base transition-all duration-200 shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  Buy Now
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-extrabold text-base cursor-not-allowed"
                >
                  Product Currently Unavailable
                </button>
              </div>
            )}

            {/* Guarantees Box */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-semibold text-neutral-500 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Genuine Digital Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Instant Delivery to Email</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
