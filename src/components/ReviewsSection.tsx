import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/types/catalog";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly
  const loop = reviews.length < 4 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews];

  return (
    <section className="w-full py-20 overflow-hidden bg-white/40 backdrop-blur-md dark:bg-neutral-900/50">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">Loved by our customers</h2>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
          Real feedback from people who shop with TechFlix.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="flex w-max animate-marquee gap-6 py-4 px-3 hover:[animation-play-state:paused]">
          {loop.map((review, idx) => (
            <figure
              key={`${review.id}-${idx}`}
              aria-hidden={idx >= reviews.length}
              className="w-80 md:w-96 flex-none bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-1" aria-label={`${review.starCount} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.starCount ? "fill-current text-[var(--color-brand-red)]" : "text-neutral-300 dark:text-neutral-700"}`}
                  />
                ))}
              </div>
              <blockquote className="text-neutral-600 dark:text-neutral-300 flex-grow italic">
                &ldquo;{review.description}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {review.profileUrl ? (
                  <Image
                    src={review.profileUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-red)] text-white font-black flex items-center justify-center">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold">{review.name}</div>
                  {review.role && <div className="text-sm text-neutral-500">{review.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
