import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getCategories } from "@/lib/data";

// One font family for the whole storefront: Inter (variable font, every weight 100–900).
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Inter has no Bengali letters: Bangla text (product descriptions, banners) falls back to this.
const bengaliFont = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "TECH FLIX | Premium Digital Subscriptions & Licenses",
  description: "Get original AI subscriptions, streaming passes, design software, and Microsoft licenses at the best price.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cached (1 h / until admin changes) and shared with pages that also need categories
  const categories = await getCategories();

  return (
    <html lang="en" suppressHydrationWarning className={`${bodyFont.variable} ${bengaliFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ThemeContextProvider>
            <CartProvider>
              <Header categories={categories} />
              <main className="flex-1 w-full flex flex-col items-center">
                {children}
              </main>
              <Footer />
              <MobileBottomNav />
              <WhatsAppButton />
            </CartProvider>
          </ThemeContextProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
