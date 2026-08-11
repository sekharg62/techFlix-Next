import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-20 min-h-[60vh]">
      <div className="flex flex-col items-center text-center p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-sm max-w-lg w-full">
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-[var(--color-brand-red)]" />
        </div>
        
        <h1 className="text-6xl font-black tracking-tight mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold mb-4">
          Page Not Found
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 bg-[var(--color-brand-red)] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
