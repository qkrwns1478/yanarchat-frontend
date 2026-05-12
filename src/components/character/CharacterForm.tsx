'use client';

import { FormEvent, useState, useRef } from 'react';
import { Paperclip, X, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface CharacterFormProps {
  initialName?: string;
  initialPersona?: string;
  submitLabel: string;
  onSubmit: (name: string, personaDescription: string, files: File[]) => Promise<void>;
}

export default function CharacterForm({
  initialName = '',
  initialPersona = '',
  submitLabel,
  onSubmit,
}: CharacterFormProps) {
  const [name, setName] = useState(initialName);
  const [persona, setPersona] = useState(initialPersona);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = '';
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(name.trim(), persona.trim(), files);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="캐릭터 이름"
        placeholder="이름을 입력해 주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={loading}
      />

      <Textarea
        label="페르소나 설명"
        placeholder="캐릭터의 성격, 특징, 배경 등을 자유롭게 설명해 주세요. AI가 나머지를 완성합니다."
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
        rows={5}
        required
        disabled={loading}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-300">참고 파일 (선택)</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip size={15} />
          파일 첨부
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300"
              >
                <span className="flex-1 truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-3 text-sm text-violet-300">
          <Loader2 size={16} className="animate-spin shrink-0" />
          AI가 캐릭터를 생성하는 중입니다. 잠시 기다려 주세요...
        </div>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
