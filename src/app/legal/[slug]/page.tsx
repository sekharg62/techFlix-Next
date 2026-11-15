import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";

interface LegalContent {
  title: string;
  subtitle: string;
  icon: any;
  updatedAt: string;
  sections: { heading: string; content: string }[];
}

const legalDocs: Record<string, LegalContent> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we collect, protect, and use your personal information.",
    icon: ShieldCheck,
    updatedAt: "August 2026",
    sections: [
      {
        heading: "1. Information Collection",
        content: "We collect personal details such as your email address and payment receipt info exclusively for fulfilling digital software license orders.",
      },
      {
        heading: "2. Data Protection",
        content: "All transactions are secured with 256-bit SSL encryption. We never store credit card numbers or sensitive payment details on our servers.",
      },
      {
        heading: "3. Third-Party Services",
        content: "We do not sell, trade, or transfer your personally identifiable information to outside parties.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "Rules and agreements governing your use of TECH FLIX services.",
    icon: FileText,
    updatedAt: "August 2026",
    sections: [
      {
        heading: "1. Service License",
        content: "Upon purchasing digital passes or subscriptions, you are granted a non-transferable license to access the specified software or streaming tier.",
      },
      {
        heading: "2. User Obligations",
        content: "You agree not to redistribute, resell, or share activation keys beyond the authorized screen or device limit.",
      },
    ],
  },
  "warranty-refund": {
    title: "Warranty & Refund Policy",
    subtitle: "Full-duration warranty, free replacement and money-back terms.",
    icon: ShieldCheck,
    updatedAt: "November 2026",
    sections: [
      {
        heading: "1. Warranty Period",
        content: "All digital keys and subscriptions come with a full-duration warranty matching the plan you bought (e.g. 1 month, 3 months, 12 months or lifetime).",
      },
      {
        heading: "2. Replacement Guarantee",
        content: "If your subscription stops working or experiences downtime, contact our support team. We replace the key or account, usually within 1–2 hours and always within 24 hours of your report.",
      },
      {
        heading: "3. 14-Day Money-Back Guarantee",
        content: "If an activation key or subscription fails to work as specified and our technical support cannot resolve it or replace it, you will receive a 100% refund.",
      },
      {
        heading: "4. How to Claim",
        content: "Message us on WhatsApp or email with your order number and a short description (or screenshot) of the problem. Claims are handled by our support team in the order they arrive.",
      },
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Warranty and refund used to be two pages; keep old links working.
  if (slug === "refund" || slug === "warranty") permanentRedirect("/legal/warranty-refund");
  const doc = legalDocs[slug];

  if (!doc) {
    notFound();
  }

  const IconComponent = doc.icon;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-[var(--color-brand-red)] flex items-center justify-center mx-auto mb-3">
          <IconComponent className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          {doc.title}
        </h1>
        <p className="text-neutral-500 text-sm">
          {doc.subtitle} • Last updated: {doc.updatedAt}
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {doc.sections.map((section, idx) => (
          <div key={idx} className="space-y-2 pb-4 border-b border-[var(--card-border)] last:border-0 last:pb-0">
            <h2 className="text-lg font-bold text-[var(--color-brand-red)]">
              {section.heading}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
