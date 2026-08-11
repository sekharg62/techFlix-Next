import { HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FaqSection() {
  return (
    <section className="max-w-4xl w-full py-20">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-[var(--color-brand-red)]" />
        </div>
        <h2 className="text-4xl font-black mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Everything you need to know about the service.
        </p>
      </div>
      <div className="space-y-4">
        {siteConfig.faqs.map((faq, index) => (
          <details 
            key={index} 
            className="group border border-[var(--card-border)] bg-[var(--card-bg)] rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-xl font-bold">
              {faq.question}
              <span className="shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-900 p-1.5 text-neutral-900 dark:text-white sm:p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
