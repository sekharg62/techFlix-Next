import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, RefreshCw, Award } from "lucide-react";
import { notFound } from "next/navigation";

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
    subtitle: "Rules and agreements governing your use of TechFlix services.",
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
  refund: {
    title: "Refund Policy",
    subtitle: "Guaranteed satisfaction and 100% money-back terms.",
    icon: RefreshCw,
    updatedAt: "August 2026",
    sections: [
      {
        heading: "1. 14-Day Money Back Guarantee",
        content: "If an activation key or subscription fail to work as specified, and our technical support cannot resolve it, you will receive a 100% instant refund.",
      },
      {
        heading: "2. Replacement Guarantee",
        content: "We offer instant key replacement within 24 hours of notification if any activation issue arises.",
      },
    ],
  },
  warranty: {
    title: "Warranty Policy",
    subtitle: "Coverage and lifetime product replacement assurances.",
    icon: Award,
    updatedAt: "August 2026",
    sections: [
      {
        heading: "1. Warranty Period",
        content: "All digital keys come with a full duration warranty matching the subscription period (e.g. 1-Month, 1-Year, or Lifetime).",
      },
      {
        heading: "2. Official Support",
        content: "If your subscription experiences downtime, our dedicated support team will replace your key within 1-2 hours.",
      },
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
