import { whyChooseUsData } from "@/constants/whyChooseUs";
import { BadgeCheck, Zap, ShieldCheck, Users, type LucideIcon } from "lucide-react";

// One icon per item in whyChooseUsData, in the same order.
const ICONS: LucideIcon[] = [BadgeCheck, Zap, ShieldCheck, Users];

export function WhyChooseUsSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Soft red glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-64 max-w-3xl rounded-full bg-[var(--color-brand-red)]/10 blur-3xl"
      />

      <div className="relative text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] mb-3">
          Why us
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Why Choose TECH <span className="text-[var(--color-brand-red)]">FLIX</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Verified subscriptions, fast delivery and real support, all at the best price.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {whyChooseUsData.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div
              key={item.title}
              className="group relative overflow-hidden flex flex-col p-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_-10px_rgba(229,9,20,0.18),0_0_90px_10px_rgba(229,9,20,0.10)]"
            >
              {/* Light red wash from the top on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-red-500/10 via-transparent to-transparent"
              />

              {/* Big faded step number */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-4 text-5xl font-black leading-none text-neutral-200 dark:text-neutral-800/80 group-hover:text-red-500/20 transition-colors select-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative w-12 h-12 mb-5 rounded-md flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-red)] to-red-800 text-white shadow-[0_6px_16px_-6px_rgba(229,9,20,0.45)]">
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>

              <h3 className="relative text-lg font-extrabold leading-snug mb-2 group-hover:text-[var(--color-brand-red)] transition-colors">
                {item.title}
              </h3>
              <p className="relative text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description}</p>

              {/* Accent line that grows on hover */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-[var(--color-brand-red)] to-red-400"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
