import { Star } from "lucide-react";
import { reviews } from "@/constants/reviews";

export function ReviewsSection() {
  return (
    <section className="w-full py-20 overflow-hidden bg-white/40 backdrop-blur-md dark:bg-neutral-900/50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Trusted by 10,000+ happy customers</h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Don't just take our word for it. See what our community has to say.
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="flex w-max animate-marquee gap-6 py-4 px-3 hover:[animation-play-state:paused]">
          {[...reviews, ...reviews].map((review, idx) => (
            <div 
              key={idx}
              className="w-80 md:w-96 flex-none bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-1 text-[var(--color-brand-red)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 flex-grow italic">
                "{review.description}"
              </p>
              <div>
                <h4 className="font-bold">{review.name}</h4>
                <p className="text-sm text-neutral-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
