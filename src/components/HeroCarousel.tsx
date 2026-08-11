"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/constants/productsData";

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  }, []);

  // Auto-play interval (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section 
      className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Viewport Fit Frame: Navbar + Hero fit 100% inside current window height */}
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-neutral-950 h-[calc(100vh-100px)] max-h-[85vh] flex items-center">
        
        {/* Slides Container - Only Image */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Linked Image Only */}
              <Link href={slide.linkUrl} className="block relative w-full h-full group">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 brightness-100"
                  sizes="100vw"
                />

                {/* Subtle vignette gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
              </Link>
            </div>
          );
        })}

        {/* Previous Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicators Dots */}
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-[var(--color-brand-red)]"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
