import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

const pixelSizes = { sm: 32, md: 40, lg: 56, xl: 80 };

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <div
        className={`${sizes[size]} relative shrink-0 overflow-hidden rounded-full bg-zinc-800 ${className}`}
      >
        <Image
          src={src}
          alt={name}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} shrink-0 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-semibold text-violet-300 ${className}`}
    >
      {initials}
    </div>
  );
}
