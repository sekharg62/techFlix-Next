"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

type Faq = { question: string; answer: string };

/** One-open-at-a-time accordion with a smooth height animation. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div
            key={faq.question}
            className={`relative rounded-lg border bg-[var(--card-bg)] transition-all duration-300 ${
              isOpen
                ? "border-[var(--color-brand-red)]/40 shadow-[0_14px_44px_-14px_rgba(229,9,20,0.25)]"
                : "border-[var(--card-border)] hover:border-neutral-400 dark:hover:border-neutral-600"
            }`}
          >
            {/* Red accent bar on the open item */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[var(--color-brand-red)] transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            />
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]/50 rounded-lg"
              >
                <span className="flex items-baseline gap-3">
                  <span className={`text-xs font-black tabular-nums transition-colors ${isOpen ? "text-[var(--color-brand-red)]" : "text-neutral-400"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-base sm:text-lg font-bold leading-snug transition-colors ${isOpen ? "text-[var(--color-brand-red)]" : ""}`}>
                    {faq.question}
                  </span>
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-[var(--color-brand-red)] text-white"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p
                  className={`px-5 sm:px-6 pb-5 pl-[2.875rem] sm:pl-[3.25rem] text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
