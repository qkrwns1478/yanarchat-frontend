import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      {/* 로고 */}
      <Link href="/" className="mb-8 text-xl font-bold text-white tracking-tight">
        Yanar<span className="text-violet-400">chat</span>
      </Link>

      {/* 카드 */}
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
