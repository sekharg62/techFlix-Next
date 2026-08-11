import { whyChooseUsData } from "@/constants/whyChooseUs";
import { CheckCircle, Zap, ShieldCheck, Star } from "lucide-react";

export function WhyChooseUsSection() {
  const icons = [
    <CheckCircle className="w-8 h-8 text-[var(--color-brand-red)]" />,
    <Zap className="w-8 h-8 text-[var(--color-brand-red)]" />,
    <ShieldCheck className="w-8 h-8 text-[var(--color-brand-red)]" />,
    <Star className="w-8 h-8 text-[var(--color-brand-red)]" />
  ];

  return (
    <section className="max-w-7xl w-full py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Why Choose Solution Zone</h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          We provide the best value and experience for your entertainment needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {whyChooseUsData.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-6 bg-neutral-100 dark:bg-neutral-900 w-16 h-16 flex items-center justify-center rounded-2xl">
              {icons[index]}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
