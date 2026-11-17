import { siteConfig } from "@/config/site";
import { siteConfig as contact } from "@/constants/siteConfig";
import { FaqAccordion } from "@/components/FaqAccordion";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

export function FaqSection() {
  return (
    <section id="faq" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-24">
      {/* Soft red glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-72 w-2/3 rounded-full bg-[var(--color-brand-red)]/10 blur-3xl"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-14 items-start">
        {/* Left: heading + contact card */}
        <div className="text-center lg:text-left lg:sticky lg:top-28">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] mb-3">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Frequently Asked <span className="text-[var(--color-brand-red)]">Questions</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto lg:mx-0">
            Quick answers about delivery, payment and support. Can&apos;t find what you need? We&apos;re a message away.
          </p>

          {contact.whatsapp && (
            <div className="hidden lg:block mt-8 p-6 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <p className="font-extrabold text-lg">Still have questions?</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Chat with our team on WhatsApp, from 9 AM to midnight.
              </p>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Right: questions */}
        <div>
          <FaqAccordion faqs={siteConfig.faqs} />

          {/* Contact card below the questions on phones and tablets */}
          {contact.whatsapp && (
            <div className="lg:hidden mt-6 p-5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-extrabold">Still have questions?</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Chat with us on WhatsApp, 9 AM to midnight.</p>
              </div>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm transition-colors shrink-0"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
