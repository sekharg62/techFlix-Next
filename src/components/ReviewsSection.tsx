import Image from "next/image";
import { Quote, Star } from "lucide-react";
import type { Review } from "@/types/catalog";

function Stars({ count, size = "w-4 h-4" }: { count: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        // How much of this star is filled (0–100%), so 4.5 shows four and a half stars.
        const fill = Math.max(0, Math.min(1, count - i)) * 100;
        return (
          <span key={i} aria-hidden="true" className={`relative inline-block ${size}`}>
            <Star className={`absolute inset-0 ${size} text-neutral-300 dark:text-neutral-700`} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <Star className={`${size} fill-amber-400 text-amber-400`} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const average = reviews.reduce((sum, r) => sum + r.starCount, 0) / reviews.length;

  // Duplicate the list so the marquee loops seamlessly (it scrolls by exactly half its width).
  const loop = reviews.length < 4 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews];

  return (
    <section className="relative w-full py-16 sm:py-20 overflow-hidden">
      {/* Soft red glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 h-72 w-full max-w-4xl rounded-full bg-[var(--color-brand-red)]/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-12">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] mb-3">
          Reviews
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Loved by our <span className="text-[var(--color-brand-red)]">customers</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Real feedback from people who shop with TECH FLIX.
        </p>

        {/* Rating summary */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-sm">
          <span className="text-2xl font-black leading-none">{average.toFixed(1)}</span>
          <Stars count={average} size="w-5 h-5" />
          <span className="hidden sm:block w-px h-6 bg-[var(--card-border)]" aria-hidden="true" />
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Trusted by 2000+ customers</span>
        </div>
      </div>

      {/* Marquee with faded edges; pauses on hover and respects reduced-motion */}
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee motion-reduce:animate-none gap-5 sm:gap-6 py-6 px-3 hover:[animation-play-state:paused]">
          {loop.map((review, idx) => (
            <figure
              key={`${review.id}-${idx}`}
              aria-hidden={idx >= reviews.length}
              className="group relative overflow-hidden w-[290px] sm:w-[360px] flex-none flex flex-col gap-4 p-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)]/40 transition-all duration-300 hover:shadow-[0_18px_60px_-10px_rgba(229,9,20,0.18),0_0_90px_10px_rgba(229,9,20,0.10)]"
            >
              <Quote
                aria-hidden="true"
                className="absolute top-4 right-4 w-10 h-10 text-neutral-200 dark:text-neutral-800 fill-current"
              />

              <Stars count={review.starCount} />

              <blockquote className="relative flex-grow text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">
                &ldquo;{review.description}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-[var(--card-border)]">
                {review.profileUrl ? (
                  <Image
                    src={review.profileUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--color-brand-red)]/30"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-brand-red)] to-red-800 text-white font-black flex items-center justify-center ring-2 ring-[var(--color-brand-red)]/30">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold truncate">{review.name}</div>
                  {review.role && <div className="text-xs text-neutral-500 truncate">{review.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
