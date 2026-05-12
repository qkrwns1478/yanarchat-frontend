'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/characters');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* 네비게이션 */}
      <header className="border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-10 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-white tracking-tight">
            Yanar<span className="text-violet-400">chat</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">회원가입</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl flex flex-col items-center gap-8">
          {/* 배지 */}
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI 캐릭터 채팅 서비스
          </span>

          {/* 타이틀 */}
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
            나만의{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AI 캐릭터
            </span>
            를<br />
            만들고 대화하세요
          </h1>

          {/* 설명 */}
          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            원하는 페르소나를 입력하면 AI가 캐릭터의 성격, 말투, 배경까지 완성해 드립니다.
            <br />
            완성된 캐릭터와 자연스러운 대화를 나눠보세요.
          </p>

          {/* CTA 버튼 */}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/signup">
              <Button size="lg">무료로 시작하기</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                로그인
              </Button>
            </Link>
          </div>
        </div>

        {/* 피처 카드 */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {
              icon: '✦',
              title: '캐릭터 자동 생성',
              desc: '이름과 설명만 입력하면 AI가 성격·말투·배경까지 자동으로 완성합니다.',
            },
            {
              icon: '◈',
              title: '실시간 스트리밍 대화',
              desc: 'AI 응답이 글자 단위로 실시간 스트리밍되어 자연스러운 대화 경험을 제공합니다.',
            },
            {
              icon: '◉',
              title: '장기 기억 시스템',
              desc: '대화를 통해 캐릭터가 당신을 기억하며, 쌓인 기억은 직접 관리할 수 있습니다.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-left flex flex-col gap-3 hover:border-zinc-700 transition-colors"
            >
              <span className="text-2xl text-violet-400">{feature.icon}</span>
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800/50 py-6 text-center text-xs text-zinc-600">
        © 2026 Yanarchat
      </footer>
    </div>
  );
}
