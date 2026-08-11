import Link from "next/link";
import { HelpCircle, Mail, MessageSquare, ShieldCheck, ArrowLeft, FileText, PhoneCall } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Help & Support Center
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
          Have questions about your subscription, license activation, or digital delivery? We are here to assist you 24/7.
        </p>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
            title: "Live Chat Support",
            description: "Chat with our technical support agents for instant activation help.",
            action: "Start Chat",
          },
          {
            icon: <Mail className="w-6 h-6 text-red-500" />,
            title: "Email Assistance",
            description: "Send your query to support@techflix.com. Typical response within 1 hour.",
            action: "Send Email",
          },
          {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
            title: "License Guarantee",
            description: "All products come with a 100% money-back guarantee and official replacement.",
            action: "Read Policy",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-neutral-500 mb-6">{card.description}</p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-[var(--color-brand-red)] hover:text-white text-xs font-extrabold transition-colors">
              {card.action}
            </button>
          </div>
        ))}
      </div>

      {/* Quick FAQ Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--color-brand-red)]" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
            <h4 className="font-bold mb-1">How fast will I receive my license key/subscription?</h4>
            <p className="text-neutral-500">Deliveries are automated and sent to your email instantly after successful order processing.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
            <h4 className="font-bold mb-1">Are all licenses genuine and original?</h4>
            <p className="text-neutral-500">Yes, 100% of our products are official software subscriptions and verified retail keys.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
