import type { Metadata } from "next";
import { Kanit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const bodyFont = Kanit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechFlix | Premium Digital Subscriptions & Licenses",
  description: "Get original AI subscriptions, streaming passes, design software, and Microsoft licenses at the best price.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodyFont.variable} ${monoFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ThemeContextProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 w-full flex flex-col items-center">
                {children}
              </main>
              <Footer />
              <MobileBottomNav />
            </CartProvider>
          </ThemeContextProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
