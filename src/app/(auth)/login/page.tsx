import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인 — Yanarchat',
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">로그인</h1>
        <p className="mt-1 text-sm text-zinc-500">계정에 로그인하세요</p>
      </div>
      <LoginForm />
    </>
  );
}
