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

  const renderWords = (text: string) => {
    return text.split(' ').map((word, i) => {
      const isCritical =
        word.toLowerCase().includes('desastre') ||
        word.toLowerCase().includes('absoluto') ||
        word.toLowerCase().includes('matarla');

      return (
        <span
          key={i}
          className={`manifesto-word inline-block mr-[0.28em] transition-colors duration-150 ${
            isCritical ? 'font-black tracking-tight' : 'font-bold'
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
      className="relative w-full bg-[#080808] text-[#F6F6F4] min-h-[220vh] z-20"
    >
      {/* Transición suave de entrada desde el Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#080808] pointer-events-none" />

      {/* Contenedor Sticky para el texto central */}
      <div
        ref={textWrapperRef}
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-24 select-none overflow-hidden"
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col items-start gap-8 sm:gap-12">
          {/* Micro-etiqueta periodística editorial */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00D2B5] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,210,181,0.8)]" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#00D2B5] font-semibold">
              // 01. EL ORIGEN DEL COLAPSO
            </span>
          </div>

          {/* Gran Párrafo Editorial Monumental con Scroll Scrub */}
          <div className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.24] sm:leading-[1.18] md:leading-[1.14] tracking-tight">
            <p className="mb-6 sm:mb-8">
              {renderWords(MANIFESTO_BLOCK_1)}
            </p>
            <p className="text-white/40">
              {renderWords(MANIFESTO_BLOCK_2)}
            </p>
          </div>

          {/* Micro-pie periodístico de referencia */}
          <div className="pt-2 border-t border-white/10 w-full flex items-center justify-between text-white/35 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
            <span>REGISTRO ARCHIVO HISTÓRICO // 2016</span>
            <span>CAPÍTULO I</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroManifestoSection;
