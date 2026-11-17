"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/types/catalog";

/** Slides arrive from the server (cached), so the first image ships with the HTML — no loading spinner. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = slides.length;
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(totalSlides, 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % Math.max(totalSlides, 1));
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  // The frame always has the banners' own shape (5:3, e.g. 1619×971), so a banner is never
  // cropped. It uses the same max width and side padding as the header and page sections.
  // Auto-play is driven by the active indicator's fill animation (see .animate-hero-progress):
  // it pauses on hover/touch, and stops for visitors who prefer reduced motion.
  return (
    <section
      className="relative w-full max-w-site mx-auto px-4 sm:px-6 pt-3 sm:pt-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        setIsPaused(false);
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 40) (dx < 0 ? nextSlide : prevSlide)();
      }}
      aria-roledescription="carousel"
      aria-label="Featured offers"
    >
      {/* Soft red glow behind the banner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-10 bottom-0 rounded-full bg-[var(--color-brand-red)]/15 blur-3xl"
      />

      <div className="group relative w-full aspect-[5/3] overflow-hidden rounded-lg bg-neutral-950 border border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.015] z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}`}
            >
              <Link href="/products" className="block relative w-full h-full" tabIndex={isActive ? 0 : -1}>
                <Image
                  src={slide.imageUrl}
                  alt={`Featured offer ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                />
              </Link>
            </div>
          );
        })}

        {/* Thin inner highlight for a polished edge */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 rounded-lg ring-1 ring-inset ring-white/10" />

        {totalSlides > 1 && (
          <>
            {/* Arrows: hidden until hover on desktop, so they never sit on top of the artwork */}
            <button
              type="button"
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Indicators below the banner: the active one fills as the slide plays */}
      {totalSlides > 1 && (
        <div className="relative flex items-center justify-center gap-2 pt-3 sm:pt-4">
          {slides.map((slide, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="group/dot py-2 cursor-pointer"
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={active}
              >
                <span
                  className={`relative block h-1 rounded-full overflow-hidden transition-all duration-300 ${
                    active ? "w-10 sm:w-12 bg-neutral-300 dark:bg-white/15" : "w-4 sm:w-5 bg-neutral-300 dark:bg-white/20 group-hover/dot:bg-neutral-400 dark:group-hover/dot:bg-white/40"
                  }`}
                >
                  {active && (
                    <span
                      key={currentIndex}
                      onAnimationEnd={nextSlide}
                      style={{ animationPlayState: isPaused ? "paused" : "running" }}
                      className="absolute inset-0 origin-left rounded-full bg-[var(--color-brand-red)] animate-hero-progress motion-reduce:animate-none motion-reduce:scale-x-100"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
