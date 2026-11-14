// Temporary page for choosing the site font. Delete this folder once a font is picked.
import {
  Urbanist,
  Space_Grotesk,
  Sora,
  Manrope,
  Lexend,
  Red_Hat_Display,
  Raleway,
  Kanit,
} from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const sora = Sora({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });
const lexend = Lexend({ subsets: ["latin"] });
const redHat = Red_Hat_Display({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });
const kanit = Kanit({ subsets: ["latin"], weight: ["300", "400", "600", "800", "900"] });

const fonts = [
  { n: 1, name: "Urbanist", note: "Sleek, sharp, modern", f: urbanist },
  { n: 2, name: "Space Grotesk", note: "Techy, editorial", f: spaceGrotesk },
  { n: 3, name: "Sora", note: "Geometric, futuristic", f: sora },
  { n: 4, name: "Manrope", note: "Refined, minimal", f: manrope },
  { n: 5, name: "Lexend", note: "Wide, very clean", f: lexend },
  { n: 6, name: "Red Hat Display", note: "Confident, corporate premium", f: redHat },
  { n: 7, name: "Raleway", note: "Elegant, luxury", f: raleway },
  { n: 8, name: "Kanit", note: "Bold, sporty, streaming-style", f: kanit },
];

export default function FontPreview() {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 py-10 space-y-6">
      <h1 className="text-3xl font-black">Font preview — pick a number</h1>
      {fonts.map(({ n, name, note, f }) => (
        <section
          key={name}
          className={`${f.className} rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6`}
        >
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            #{n} · {name} — {note}
          </p>
          <p className="text-4xl font-black tracking-tight">
            TECH<span className="text-[var(--color-brand-red)]">FLIX</span>
          </p>
          <h2 className="mt-3 text-3xl font-black" style={{ fontFamily: "inherit" }}>
            Premium Digital Subscriptions
          </h2>
          <h3 className="mt-1 text-xl font-bold" style={{ fontFamily: "inherit" }}>
            ChatGPT Plus · Netflix Premium · Adobe Creative Cloud
          </h3>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Your trusted marketplace for verified AI subscriptions, streaming passes, design suites, and official software licenses. Instant delivery, 24/7 support.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-extrabold">৳ 2,499</span>
            <span className="rounded-full bg-[var(--color-brand-red)] px-5 py-2 text-sm font-bold text-white">
              Buy Now
            </span>
          </div>
        </section>
      ))}
    </div>
  );
}
