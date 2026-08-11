import { ThemeToggle } from "@/components/theme-toggle";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-[var(--card-border)]">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <PlayCircle className="w-8 h-8 text-[var(--color-brand-red)]" />
        <span className="text-2xl font-black tracking-tighter">
          TECH<span className="text-[var(--color-brand-red)]">FLIX</span>
        </span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
        <Link href="/" className="hover:text-[var(--color-brand-red)] transition-colors">Home</Link>
        <Link href="/movies" className="hover:text-[var(--color-brand-red)] transition-colors">Movies</Link>
        <Link href="/series" className="hover:text-[var(--color-brand-red)] transition-colors">Series</Link>
        <Link href="/my-list" className="hover:text-[var(--color-brand-red)] transition-colors">My List</Link>
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
