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

  // Función para descomponer el texto en caracteres manteniendo palabras agrupadas
  const renderTypewriterText = (text: string, isSubtitle = false) => {
    const words = text.split(' ');

    return words.map((word, wordIdx) => {
      const isCriticalGold =
        word.toLowerCase().includes('desastre') ||
        word.toLowerCase().includes('absoluto') ||
        word.toLowerCase().includes('matarla');

      return (
        <span
          key={wordIdx}
          className={`inline-block whitespace-nowrap mx-[0.14em] ${
            isCriticalGold
              ? 'text-[#FFD700] drop-shadow-[0_0_16px_rgba(255,215,0,0.55)] font-black'
              : ''
          }`}
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
      ref={containerRef}
      className="relative w-full bg-[#080808] text-[#F6F6F4] min-h-[260vh] z-20"
    >
      {/* Transición suave de entrada desde el Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#080808] pointer-events-none" />

      {/* Contenedor Sticky para el texto central */}
      <div
        ref={textWrapperRef}
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-24 select-none overflow-hidden"
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          {/* Bloque 1: Titular Principal con Typewriter Reveal */}
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.22] sm:leading-[1.18] md:leading-[1.14] tracking-tight max-w-4xl font-bold">
            {renderTypewriterText(MANIFESTO_BLOCK_1, false)}
          </h2>

          {/* Bloque 2: Subtítulo secundario en Cursiva y letras más pequeñas */}
          <p className="font-body italic text-base sm:text-xl md:text-2xl text-white/90 leading-relaxed sm:leading-snug max-w-2xl font-normal tracking-wide mt-6 sm:mt-8">
            {renderTypewriterText(MANIFESTO_BLOCK_2, true)}
          </p>
        </div>

        {/* Indicador de scroll inferior interactivo con animación sutil */}
        <div
          className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none transition-all duration-500 ease-out ${
            scrollProgress > 0.88 ? 'opacity-0 translate-y-3' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="relative w-5 h-8.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-start justify-center p-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <div className="w-1 h-2 rounded-full bg-gradient-to-b from-[#FFD700] to-[#FFFFFF] animate-scroll-wheel shadow-[0_0_6px_rgba(255,215,0,0.7)]" />
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.26em] text-[#E0E0DC]/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

export default IntroManifestoSection;
