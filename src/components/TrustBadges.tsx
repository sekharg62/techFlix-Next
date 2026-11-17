import { BadgeCheck, Truck, Users } from "lucide-react";

const BADGES = [
  { icon: BadgeCheck, label: "100% Verified" },
  { icon: Truck, label: "Usually Delivery Within 5-10 mins" },
  { icon: Users, label: "Trusted By 2000+ Customers" },
];

/** Pill of trust tags shown under the hero banner. */
export function TrustBadges() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-3 sm:mt-4 flex justify-center">
      <ul
        aria-label="Why shop with TECH FLIX"
        className="inline-flex flex-wrap items-center justify-center gap-x-1 gap-y-1 p-1.5 rounded-3xl sm:rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-sm shadow-sm"
      >
        {BADGES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 pl-1.5 pr-3 sm:pr-4 py-1">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 dark:border-white/25 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-100 whitespace-nowrap">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
