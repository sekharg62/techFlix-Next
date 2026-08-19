"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { HERO_SLIDES } from "@/constants/productsData";
import { heroSlideService } from "@/services/heroSlideService";
import { HeroSlideItem } from "@/types/heroSlide";

// Unified slide format for rendering
interface DisplaySlide {
  id: string;
  order: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<DisplaySlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Hero Slides from API
  useEffect(() => {
    let isMounted = true;

    async function fetchSlides() {
      try {
        setIsLoading(true);
        const data: HeroSlideItem[] = await heroSlideService.getAllHeroSlides();

        if (isMounted) {
          if (data && data.length > 0) {
            // Already sorted order ascending in service, map to display format
            const formattedSlides: DisplaySlide[] = data.map((item, index) => ({
              id: item.id || `slide-${item.order || index + 1}`,
              order: item.order ?? index + 1,
              imageUrl: item.imageUrl,
              linkUrl: item.linkUrl || "/products",
              title: item.title || `TechFlix Feature ${item.order ?? index + 1}`,
            }));
            setSlides(formattedSlides);
          } else {
            // Fallback to static slides if API returns empty
            const fallback: DisplaySlide[] = HERO_SLIDES.map((s, idx) => ({
              id: s.id,
              order: idx + 1,
              imageUrl: s.imageUrl,
              linkUrl: s.linkUrl,
              title: s.title,
            }));
            setSlides(fallback);
          }
        }
      } catch {
        if (isMounted) {
          // Fallback to static slides on error
          const fallback: DisplaySlide[] = HERO_SLIDES.map((s, idx) => ({
            id: s.id,
            order: idx + 1,
            imageUrl: s.imageUrl,
            linkUrl: s.linkUrl,
            title: s.title,
          }));
          setSlides(fallback);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-play interval (5 seconds)
  useEffect(() => {
    if (isPaused || totalSlides <= 1 || isLoading) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, isLoading, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Loading skeleton state
  if (isLoading && slides.length === 0) {
    return (
      <section className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-2">
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-neutral-900/60 h-[calc(100vh-100px)] max-h-[85vh] flex items-center justify-center animate-pulse">
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-red)]" />
            <span className="text-sm font-medium tracking-wide">Loading featured slides...</span>
          </div>
        </div>
      </section>
    );
  }

  if (totalSlides === 0) {
    return null;
  }

  return (
    <section 
      className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero Carousel"
    >
      {/* Viewport Fit Frame: Navbar + Hero fit 100% inside current window height */}
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-neutral-950 h-[calc(100vh-100px)] max-h-[85vh] flex items-center">
        
        {/* Slides Container - Only Image */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {/* Linked Image Only */}
              <Link href={slide.linkUrl} className="block relative w-full h-full group">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 brightness-100"
                  sizes="(max-width: 1400px) 100vw, 1400px"
                />

                {/* Subtle vignette gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </Link>
            </div>
          );
        })}

        {/* Previous Arrow Button */}
        {totalSlides > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Arrow Button */}
        {totalSlides > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Indicators Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
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
        )}

      </div>
    </section>
  );
}
