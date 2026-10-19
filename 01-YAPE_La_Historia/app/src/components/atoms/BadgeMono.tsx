import React from 'react';

interface BadgeMonoProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'accent';
  className?: string;
}

export const BadgeMono: React.FC<BadgeMonoProps> = ({
  children,
  variant = 'outline',
  className = '',
}) => {
  const base =
    'inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border select-none';

  const styles = {
    outline: 'border-[#333333] bg-[#0A0A0A]/80 text-[#D0D0CE] backdrop-blur-xs',
    solid: 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold',
    accent: 'border-[#333333] bg-[#111111] text-[#00D2B5]',
  };

  return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>;
};
