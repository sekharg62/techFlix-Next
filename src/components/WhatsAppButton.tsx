import { siteConfig } from "@/constants/siteConfig";

/** WhatsApp glyph (brand icons are not in lucide-react). */
export function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C8.82 3 3.004 8.817 3.004 16c0 2.295.6 4.535 1.74 6.51L3 29l6.65-1.71A12.94 12.94 0 0 0 16.004 29C23.186 29 29 23.183 29 16S23.186 3 16.004 3Zm0 23.62c-2.02 0-4-.54-5.73-1.57l-.41-.24-3.95 1.02 1.05-3.85-.27-.42A10.56 10.56 0 0 1 5.39 16c0-5.86 4.76-10.62 10.61-10.62 5.86 0 10.62 4.76 10.62 10.62 0 5.85-4.76 10.62-10.62 10.62Zm5.82-7.95c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.83 1.04-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.57 1.14 3.08 1.3 3.29.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

/** Sticky WhatsApp chat button, bottom-right on every page (sits above the mobile bottom nav). */
export function WhatsAppButton() {
  if (!siteConfig.whatsapp) return null;

  return (
    <a
      data-print-hide
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-24 md:right-6 md:bottom-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 hover:bg-[#1ebe5b] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping group-hover:hidden" aria-hidden="true" />
      <WhatsAppIcon className="relative w-8 h-8" />
    </a>
  );
}
