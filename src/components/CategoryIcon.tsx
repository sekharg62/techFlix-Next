import { Bot, Video, Palette, PenTool, Shield, Tv, AppWindow, Code2, Layers, Music, GraduationCap } from "lucide-react";

/** Picks an icon from the category slug/name so new categories still get a sensible icon. */
export function CategoryIcon({ slug, name, className = "w-4 h-4" }: { slug: string; name: string; className?: string }) {
  const key = `${slug} ${name}`.toLowerCase();

  if (/dev|code|program/.test(key)) return <Code2 className={`${className} text-indigo-500`} />;
  if (/design|creativ|art/.test(key)) return <Palette className={`${className} text-pink-500`} />;
  if (/stream|ott|tv|movie/.test(key)) return <Tv className={`${className} text-amber-500`} />;
  if (/music|audio|spotify/.test(key)) return <Music className={`${className} text-green-500`} />;
  if (/\bai\b|ai-|bot|gpt|intel/.test(key)) return <Bot className={`${className} text-purple-500`} />;
  if (/video|film|edit/.test(key)) return <Video className={`${className} text-red-500`} />;
  if (/writ|pen|content|doc/.test(key)) return <PenTool className={`${className} text-emerald-500`} />;
  if (/vpn|secur|guard/.test(key)) return <Shield className={`${className} text-blue-500`} />;
  if (/educat|learn|course/.test(key)) return <GraduationCap className={`${className} text-cyan-500`} />;
  if (/micro|app|soft|office|productiv/.test(key)) return <AppWindow className={`${className} text-sky-500`} />;
  return <Layers className={`${className} text-[var(--color-brand-red)]`} />;
}
