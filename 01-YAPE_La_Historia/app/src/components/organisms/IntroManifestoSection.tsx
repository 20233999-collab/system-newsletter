import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Copy editorial dividido en bloques y palabras
const MANIFESTO_BLOCK_1 = "Hoy está instalada en el bolsillo de casi todos, pero en su primer fin de semana de lanzamiento fue un desastre absoluto.";
const MANIFESTO_BLOCK_2 = "Esta no es la historia de una aplicación exitosa; son los desafíos que enfrentaron y estuvieron a punto de matarla.";

export const IntroManifestoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textWrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si el usuario prefiere movimiento reducido, dejamos todo iluminado sin scrub agresivo
    if (prefersReducedMotion) {
      gsap.set('.manifesto-word', { opacity: 1, color: '#FFFFFF' });
      return;
    }

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.manifesto-word');

      gsap.fromTo(
        words,
        {
          opacity: 0.15,
          color: '#262626',
        },
        {
          opacity: 1,
          color: '#FFFFFF',
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=140%',
            pin: textWrapperRef.current,
            scrub: 0.75,
            anticipatePin: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderWords = (text: string, isSubtitle = false) => {
    return text.split(' ').map((word, i) => {
      const isCritical =
        word.toLowerCase().includes('desastre') ||
        word.toLowerCase().includes('absoluto') ||
        word.toLowerCase().includes('matarla');

      return (
        <span
          key={i}
          className={`manifesto-word inline-block mx-[0.14em] transition-colors duration-150 ${
            isSubtitle
              ? isCritical
                ? 'font-bold text-[#00D2B5] drop-shadow-[0_0_12px_rgba(0,210,181,0.5)]'
                : 'font-medium'
              : isCritical
              ? 'font-black tracking-tight text-white'
              : 'font-bold'
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#080808] text-[#F6F6F4] min-h-[240vh] z-20"
    >
      {/* Transición suave de entrada desde el Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#080808] pointer-events-none" />

      {/* Contenedor Sticky para el texto central */}
      <div
        ref={textWrapperRef}
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-24 select-none overflow-hidden"
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-7 sm:gap-10">
          {/* Micro-etiqueta periodística editorial centrada */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#00D2B5] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,210,181,0.9)]" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#00D2B5] font-semibold">
              // 01. EL ORIGEN DEL COLAPSO
            </span>
          </div>

          {/* Bloque 1: Gran Titular Monumental */}
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.2] sm:leading-[1.16] md:leading-[1.12] tracking-tight max-w-4xl">
            {renderWords(MANIFESTO_BLOCK_1)}
          </h2>

          {/* Separador editorial minimalista con glow */}
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#00D2B5]/60 to-transparent my-1 sm:my-2" />

          {/* Bloque 2: Subtítulo secundario, refinado y llamativo */}
          <p className="font-body text-base sm:text-xl md:text-2xl text-white/90 leading-relaxed sm:leading-snug max-w-2xl font-light tracking-normal">
            {renderWords(MANIFESTO_BLOCK_2, true)}
          </p>

          {/* Micro-pie periodístico de referencia centrado */}
          <div className="pt-4 border-t border-white/10 w-full max-w-md flex items-center justify-between text-white/35 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
            <span>REGISTRO ARCHIVO // 2016</span>
            <span>CAPÍTULO I</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroManifestoSection;
