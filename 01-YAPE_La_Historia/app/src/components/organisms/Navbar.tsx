import React, { useEffect, useState } from 'react';
import { BoxButton } from '../atoms/BoxButton';
import { BadgeMono } from '../atoms/BadgeMono';
import { Share2, Volume2, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, Math.round(currentProgress))));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between border border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-md px-4 md:px-6 py-2.5">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#FFFFFF] animate-pulse" />
          <span className="font-display font-extrabold text-sm md:text-base tracking-tight text-[#FFFFFF]">
            YAPE
          </span>
          <span className="text-[#444444] text-xs font-mono hidden sm:inline">//</span>
          <span className="text-[#888888] text-xs font-mono tracking-wider hidden sm:inline uppercase">
            01. La Historia
          </span>
        </div>

        {/* Center Progress Box */}
        <div className="flex items-center gap-2">
          <BadgeMono variant="outline">
            <span className="text-[#666666]">PROGRESO</span>
            <span className="text-[#FFFFFF] font-bold">
              {String(scrollProgress).padStart(2, '0')}%
            </span>
          </BadgeMono>
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#222222]">
            <BadgeMono variant="accent">
              <Sparkles className="w-2.5 h-2.5" />
              <span>CASO DE ESTUDIO</span>
            </BadgeMono>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            title="Activar audio de la experiencia"
            className="p-2 border border-[#262626] bg-[#111111] text-[#AAAAAA] hover:text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors cursor-pointer hidden sm:flex items-center justify-center"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          
          <BoxButton
            variant="primary"
            className="text-[11px] py-2 px-3.5"
            icon={<Share2 className="w-3 h-3" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Yape: La Historia',
                  text: 'El imperio que casi muere en 72 horas.',
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
          >
            <span className="hidden sm:inline">Compartir</span>
          </BoxButton>
        </div>
      </div>
    </header>
  );
};
