import { PlayCircle, Shield, Zap, ChevronRight } from "lucide-react";
import { FaqSection } from "@/components/FaqSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <section className="max-w-4xl w-full text-center py-20 mt-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
          The Future of <br className="hidden md:block" />
          <span className="text-[var(--color-brand-red)]">Entertainment</span> is Here.
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10">
          Experience unlimited streaming with crystal-clear 4K quality, 
          exclusive content, and seamless viewing across all your devices.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="flex items-center gap-2 bg-[var(--color-brand-red)] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
            Start Free Trial
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-8 py-4 rounded-full font-bold text-lg hover:opacity-80 transition-opacity">
            View Plans
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl w-full py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Zap className="w-8 h-8 text-[var(--color-brand-red)]" />,
            title: "Lightning Fast",
            description: "Zero buffering with our globally distributed CDN infrastructure."
          },
          {
            icon: <Shield className="w-8 h-8 text-[var(--color-brand-red)]" />,
            title: "Secure & Private",
            description: "Your data and viewing habits are encrypted end-to-end."
          },
          {
            icon: <PlayCircle className="w-8 h-8 text-[var(--color-brand-red)]" />,
            title: "Exclusive Originals",
            description: "Access award-winning original series and movies you won't find anywhere else."
          }
        ].map((feature, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center text-center p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <WhyChooseUsSection />
      <ReviewsSection />
      <FaqSection />
    </div>
  );
}
