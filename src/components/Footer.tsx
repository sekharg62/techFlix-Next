import { siteConfig } from "@/constants/siteConfig";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--card-bg)] border-t border-[var(--card-border)] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-black tracking-tighter mb-4">
            TECH<span className="text-[var(--color-brand-red)]">FLIX</span>
          </h2>
          <p className="text-neutral-500 max-w-xs mb-6">
            The ultimate streaming experience with the best original content and unlimited 4K viewing.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <li>
              <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-[var(--color-brand-red)] transition-colors">
                <Phone className="w-4 h-4" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-brand-red)] transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-[var(--color-brand-red)] transition-colors">
                <Mail className="w-4 h-4" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <a 
              href={siteConfig.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-[var(--color-brand-red)] hover:text-white transition-colors"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a 
              href={siteConfig.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-[var(--color-brand-red)] hover:text-white transition-colors"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="w-full text-center text-neutral-500 mt-12 pt-8 border-t border-[var(--card-border)]">
        <p>© {new Date().getFullYear()} TechFlix. All rights reserved.</p>
      </div>
    </footer>
  );
}
