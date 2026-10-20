import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Copy editorial
const MANIFESTO_BLOCK_1 = "Hoy está instalada en el bolsillo de casi todos, pero en su primer fin de semana de lanzamiento fue un desastre absoluto.";
const MANIFESTO_BLOCK_2 = "Esta no es la historia de una aplicación exitosa; son los desafíos que enfrentaron y estuvieron a punto de matarla.";

export const IntroManifestoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  // Control del temporizador de inactividad (Opción 2: Idle Pulse tras 3s quieto)
  useEffect(() => {
    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    };

    window.addEventListener('scroll', resetIdleTimer, { passive: true });
    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('touchstart', resetIdleTimer, { passive: true });

    // Iniciar temporizador al montar
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
    }, 3200);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !textWrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.typewriter-char', { opacity: 1, display: 'inline' });
      return;
    }

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>('.typewriter-char');

      // Animación estilo Typewriter sincronizada milimétricamente con el scroll
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          display: 'none',
        },
        {
          opacity: 1,
          display: 'inline',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=160%',
            pin: textWrapperRef.current,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
            },
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Función para descomponer el texto en caracteres manteniendo palabras agrupadas con efecto ola armónica recontra sutil
  const renderTypewriterText = (text: string, isSubtitle = false, offsetIndex = 0) => {
    const words = text.split(' ');

    return words.map((word, wordIdx) => {
      const isCriticalGold =
        word.toLowerCase().includes('desastre') ||
        word.toLowerCase().includes('absoluto') ||
        word.toLowerCase().includes('matarla');

      // Efecto ola armónica continua: cadencia fija de 0.12s por palabra para propagación fluida
      const globalWordIndex = offsetIndex + wordIdx;
      const waveDelay = `${(globalWordIndex * 0.12).toFixed(2)}s`;

      return (
        <span
          key={wordIdx}
          className={`inline-block whitespace-nowrap mx-[0.14em] animate-word-wave ${
            isCriticalGold
              ? 'text-[#FFD700] drop-shadow-[0_0_16px_rgba(255,215,0,0.55)] font-black'
              : ''
          }`}
          style={{
            animationDelay: waveDelay,
          }}
        >
          {word.split('').map((char, charIdx) => (
            <span
              key={charIdx}
              className={`typewriter-char ${
                isSubtitle && !isCriticalGold ? 'text-white/85' : ''
              }`}
            >
              {char}
            </span>
          ))}
          {/* Espacio final entre palabras */}
          <span className="typewriter-char inline-block">&nbsp;</span>
        </span>
      );
    });
  };

  return (
    <section
      id="seccion-intro"
      ref={containerRef}
      className="relative w-full bg-[#080808] text-[#F6F6F4] min-h-[260vh] z-20"
    >
      {/* Transición suave de entrada desde el Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#080808] pointer-events-none" />

      {/* Resplandor ambiental cinemático perpetuo en movimiento sutil */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
        <div className="w-[50rem] h-[35rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.06)_0%,rgba(0,210,181,0.03)_40%,transparent_70%)] blur-3xl animate-ambient-glow" />
      </div>

      {/* Contenedor Sticky para el texto central */}
      <div
        ref={textWrapperRef}
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-24 select-none overflow-hidden"
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          {/* Bloque 1: Titular Principal con Typewriter Reveal */}
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.22] sm:leading-[1.18] md:leading-[1.14] tracking-tight max-w-4xl font-bold">
            {renderTypewriterText(MANIFESTO_BLOCK_1, false, 0)}
          </h2>

          {/* Bloque 2: Subtítulo secundario en Cursiva y letras más pequeñas */}
          <p className="font-body italic text-base sm:text-xl md:text-2xl text-white/90 leading-relaxed sm:leading-snug max-w-2xl font-normal tracking-wide mt-6 sm:mt-8">
            {renderTypewriterText(MANIFESTO_BLOCK_2, true, 25)}
          </p>
        </div>

        {/* Indicador de scroll centrado mediante flexbox completo, ultra-simple y minimalista */}
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex justify-center pointer-events-none select-none z-30">
          <div
            className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out ${
              isIdle || scrollProgress > 0.92
                ? 'opacity-85 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Micro-cápsula ultra-minimalista */}
            <div className="w-4 h-7 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-start justify-center p-0.5 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              <div className="w-1 h-1.5 rounded-full bg-gradient-to-b from-[#FFD700] to-white animate-scroll-wheel shadow-[0_0_6px_rgba(255,215,0,0.8)]" />
            </div>

            {/* Micro-label monoespaciado centrado */}
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] pl-[0.28em]">
              {scrollProgress > 0.92 ? 'Continuar' : 'Scroll'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroManifestoSection;
