import { Check } from "lucide-react";

const STEPS = ["Cart", "Checkout", "Done"];

/** Cart → Checkout → Done progress, shared by the cart, checkout and order-placed screens. */
export function OrderSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold" aria-label="Order progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        // The last step counts as done once reached.
        const state = n < current || (n === current && n === STEPS.length) ? "done" : n === current ? "current" : "todo";
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-2" aria-current={n === current ? "step" : undefined}>
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black ${
                  state === "current"
                    ? "bg-[var(--color-brand-red)] text-white shadow-[0_0_0_4px_rgba(229,9,20,0.15)]"
                    : state === "done"
                      ? "bg-emerald-500 text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                }`}
              >
                {state === "done" ? <Check className="w-3.5 h-3.5" /> : n}
              </span>
              <span className={state === "todo" ? "text-neutral-400" : "text-neutral-900 dark:text-white"}>{label}</span>
            </span>
            {n < STEPS.length && (
              <span aria-hidden="true" className={`w-6 sm:w-12 h-px ${n < current ? "bg-emerald-500" : "bg-[var(--card-border)]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
