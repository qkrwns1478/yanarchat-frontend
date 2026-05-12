import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 — Yanarchat',
};

export default function SignupPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">회원가입</h1>
        <p className="mt-1 text-sm text-zinc-500">새 계정을 만들어 시작하세요</p>
      </div>
      <SignupForm />
    </>
  );
}
