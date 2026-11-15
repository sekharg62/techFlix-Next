"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/types/catalog";

/** Slides arrive from the server (cached), so the first image ships with the HTML — no loading spinner. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(totalSlides, 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % Math.max(totalSlides, 1));
  }, [totalSlides]);

  // Auto-play every 5s (paused on hover or while the tab is hidden)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      if (!document.hidden) nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, nextSlide]);

  if (totalSlides === 0) return null;

  return (
    <section
      className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }}
      aria-roledescription="carousel"
      aria-label="Featured offers"
    >
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-neutral-950 h-[calc(100vh-100px)] max-h-[85vh] flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}`}
            >
              <Link href="/products" className="block relative w-full h-full group" tabIndex={isActive ? 0 : -1}>
                <Image
                  src={slide.imageUrl}
                  alt={`Featured offer ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                  sizes="(max-width: 1400px) 100vw, 1400px"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </Link>
            </div>
          );
        })}

        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-8 bg-[var(--color-brand-red)]" : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
