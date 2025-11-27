import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="text-9xl font-bold text-slate-800 select-none">
          404
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
