import React from 'react';

interface BoxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const BoxButton: React.FC<BoxButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  icon,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2.5 font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:translate-x-0 active:translate-y-0 active:shadow-none';

  const variants = {
    primary:
      'bg-[#FFFFFF] text-[#000000] border border-[#FFFFFF] px-5 py-3 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutalist-white',
    secondary:
      'bg-[#111111] text-[#FFFFFF] border border-[#333333] px-5 py-3 hover:border-[#FFFFFF] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutalist-white',
    ghost:
      'bg-transparent text-[#D0D0CE] border border-transparent px-3 py-2 hover:text-[#FFFFFF] hover:border-[#333333]',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};
