import React, { useEffect, useRef, useState } from 'react';
import { Move } from 'lucide-react';
import { type HeroVisualConfig, saveHeroConfig, loadHeroConfig } from '../../utils/visualConfig';
import { VisualControls } from './VisualControls';
import gsap from 'gsap';

export const HeroStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const nubesTrack1Ref = useRef<HTMLDivElement>(null);
  const nubesTrack2Ref = useRef<HTMLDivElement>(null);
  const nubesOverYapeRef = useRef<HTMLDivElement>(null);
  const mistTrack1Ref = useRef<HTMLDivElement>(null);
  const mistTrack2Ref = useRef<HTMLDivElement>(null);
  const edificiosBackParallaxRef = useRef<HTMLDivElement>(null);
  const edificiosBackIntroRef = useRef<HTMLDivElement>(null);
  const edificiosBackMarqueeRef = useRef<HTMLDivElement>(null);
  const yapeParallaxRef = useRef<HTMLDivElement>(null);
  const yapeIntroRef = useRef<HTMLDivElement>(null);
  const yapeFloatRef = useRef<HTMLDivElement>(null);
  const edificiosFrontParallaxRef = useRef<HTMLDivElement>(null);
  const edificiosFrontIntroRef = useRef<HTMLDivElement>(null);
  const edificiosFrontMarqueeRef = useRef<HTMLDivElement>(null);

  // Visual Interactive Config State (Persisted in localStorage)
  const [config, setConfig] = useState<HeroVisualConfig>(loadHeroConfig);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof HeroVisualConfig>('edificiosBack');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [hasScrolled, setHasScrolled] = useState(false);

  // High-performance GSAP quickTo setters (Zero React re-renders during mouse move)
  const quickSetters = useRef<{
    skyX?: (v: number) => void;
    skyY?: (v: number) => void;
    backX?: (v: number) => void;
    backY?: (v: number) => void;
    yapeX?: (v: number) => void;
    yapeY?: (v: number) => void;
    frontX?: (v: number) => void;
    frontY?: (v: number) => void;
  }>({});
  const activeTweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setHasScrolled(window.scrollY > 35);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize hardware-accelerated quickTo setters
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (skyRef.current) {
      quickSetters.current.skyX = gsap.quickTo(skyRef.current, 'x', { duration: 1.5, ease: 'power2.out' });
      quickSetters.current.skyY = gsap.quickTo(skyRef.current, 'y', { duration: 1.5, ease: 'power2.out' });
    }
    if (edificiosBackParallaxRef.current) {
      quickSetters.current.backX = gsap.quickTo(edificiosBackParallaxRef.current, 'x', { duration: 1.4, ease: 'power2.out' });
      quickSetters.current.backY = gsap.quickTo(edificiosBackParallaxRef.current, 'y', { duration: 1.4, ease: 'power2.out' });
    }
    if (yapeParallaxRef.current) {
      quickSetters.current.yapeX = gsap.quickTo(yapeParallaxRef.current, 'x', { duration: 1.25, ease: 'power2.out' });
      quickSetters.current.yapeY = gsap.quickTo(yapeParallaxRef.current, 'y', { duration: 1.25, ease: 'power2.out' });
    }
    if (edificiosFrontParallaxRef.current) {
      quickSetters.current.frontX = gsap.quickTo(edificiosFrontParallaxRef.current, 'x', { duration: 1.1, ease: 'power2.out' });
      quickSetters.current.frontY = gsap.quickTo(edificiosFrontParallaxRef.current, 'y', { duration: 1.1, ease: 'power2.out' });
    }
  }, []);

  // Save changes automatically
  const handleConfigChange = (newConfig: HeroVisualConfig) => {
    setConfig(newConfig);
    saveHeroConfig(newConfig);
  };

  // Dragging interaction state
  const draggingItem = useRef<keyof HeroVisualConfig | null>(null);
  const dragStart = useRef({ x: 0, y: 0, initialElemX: 0, initialElemY: 0 });

  const startDrag = (key: keyof HeroVisualConfig, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditorOpen) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(key);
    draggingItem.current = key;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = {
      x: clientX,
      y: clientY,
      initialElemX: config[key].x,
      initialElemY: config[key].y,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      // Parallax mouse position via quickTo (Zero React re-render overhead)
      if ('clientX' in e && window.innerWidth >= 768 && !draggingItem.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        const q = quickSetters.current;
        q.skyX?.(x * -8);
        q.skyY?.(y * -4);
        q.backX?.(x * -16);
        q.backY?.(y * -6);
        q.yapeX?.(x * -28);
        q.yapeY?.(y * -10);
        q.frontX?.(x * -48);
        q.frontY?.(y * -16);
      }

      // Dragging logic
      if (!draggingItem.current) return;
      const key = draggingItem.current;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const isBuilding = key === 'edificiosBack' || key === 'edificiosFront';

      if (isBuilding) {
        // Buildings move in pixel offset
        const deltaX = clientX - dragStart.current.x;
        const deltaY = clientY - dragStart.current.y;

        const updated = {
          ...config,
          [key]: {
            ...config[key],
            x: Math.round(dragStart.current.initialElemX + deltaX),
            y: Math.round(dragStart.current.initialElemY - deltaY),
          },
        };
        setConfig(updated);
        saveHeroConfig(updated);
      } else {
        // Elements in percentage
        const deltaX = ((clientX - dragStart.current.x) / window.innerWidth) * 100;
        const deltaY = ((clientY - dragStart.current.y) / window.innerHeight) * 100;

        const updated = {
          ...config,
          [key]: {
            ...config[key],
            x: Math.round(dragStart.current.initialElemX + deltaX),
            y: Math.round(dragStart.current.initialElemY - deltaY),
          },
        };
        setConfig(updated);
        saveHeroConfig(updated);
      }
    };

    const handleEnd = () => {
      draggingItem.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [config]);

  // Vox-style continuous drifting clouds and mist (infinite seamless loops)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nubes Track 1: slower high altitude drift (65s infinite seamless loop)
      const t1 = gsap.to(nubesTrack1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 65,
        repeat: -1,
      });

      // Nubes Track 2: medium altitude dynamic drift (45s infinite seamless loop)
      const t2 = gsap.to(nubesTrack2Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 45,
        repeat: -1,
      });

      // Nubes pasando por encima de Yape (32s loop continuo)
      const t3 = gsap.to(nubesOverYapeRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 32,
        repeat: -1,
      });

      // Neblina Track 1: Bruma intermedia horizontal (38s infinite loop)
      const t4 = gsap.to(mistTrack1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 38,
        repeat: -1,
      });

      // Neblina Track 2: Velo bajo de suelo a contraviento (28s loop inverso)
      const t5 = gsap.to(mistTrack2Ref.current, {
        xPercent: 50,
        ease: 'none',
        duration: 28,
        repeat: -1,
      });

      // ========================================================
      // MÓDULO 1: RESPIRACIÓN SUTIL DE YAPE EN SU SITIO (SIN DESPLAZARSE)
      // ========================================================
      const t6 = gsap.to(yapeFloatRef.current, {
        scaleY: 1.022,
        scaleX: 0.99,
        transformOrigin: 'bottom center',
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      activeTweens.current = [t1, t2, t3, t4, t5, t6];

      // ========================================================
      // MÓDULO 3: INTRO ANIMATION ESTILO VOX (COLLAGE WORKBENCH)
      // Recortes analógicos que se arrastran y estampan en la mesa
      // ========================================================
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Pliego de fondo / cielo que se asienta sobre la mesa de trabajo
      tl.fromTo(skyRef.current, {
        scale: 1.05,
        opacity: 0.35,
      }, {
        scale: 1.0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
      })

      // 2. Edificios de Fondo: Arrastre con inercia desde la izquierda con micro-rotación
      .fromTo(edificiosBackIntroRef.current, {
        x: -160,
        y: 55,
        rotation: -2.4,
        opacity: 0,
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
      }, '-=0.75')

      // 3. Titular Monumental: Estampado tipográfico en cascada rápida
      .fromTo('.hero-headline-chunk', {
        y: 45,
        rotation: 1.8,
        opacity: 0,
      }, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power4.out',
      }, '-=0.65')

      // 4. Yape Superhéroe: Cutout Drop & Slap (Recorte colocado que cae y se estampa)
      .fromTo(yapeIntroRef.current, {
        y: -120,
        scale: 1.25,
        rotation: 4.8,
        opacity: 0,
      }, {
        y: 0,
        scale: 1.0,
        rotation: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.35)',
      }, '-=0.55')

      // 5. Edificios Frente: Tarjeta troquelada que sube y calza tapando los zapatos de Yape
      .fromTo(edificiosFrontIntroRef.current, {
        y: 110,
        rotation: 1.2,
        opacity: 0,
      }, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.55')

      // 6. Subtítulo periodístico: Ficha de archivo que se asienta
      .fromTo('.hero-subtext-chunk', {
        y: 25,
        rotation: -1,
        opacity: 0,
      }, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.45')

      // 7. Scroll cue minimalista
      .fromTo('.hero-scroll-cue', {
        opacity: 0,
        y: 15,
      }, {
        opacity: 0.8,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.25');
    });

    return () => ctx.revert();
  }, []);

  // Multiplane Cinematic Parallax (Disabled when dragging or on small screens)
  // Sleep Mode: Pausa animaciones infinitas de GSAP y CSS cuando el Hero no está visible o la pestaña está oculta
  useEffect(() => {
    if (!containerRef.current) return;

    const setRunning = (running: boolean) => {
      activeTweens.current.forEach((t) => (running ? t.play() : t.pause()));
      if (edificiosBackMarqueeRef.current) {
        edificiosBackMarqueeRef.current.style.animationPlayState = running ? 'running' : 'paused';
      }
      if (edificiosFrontMarqueeRef.current) {
        edificiosFrontMarqueeRef.current.style.animationPlayState = running ? 'running' : 'paused';
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRunning(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);

    const handleVisibility = () => {
      setRunning(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-between pt-20 pb-5 px-4 md:px-8 overflow-hidden bg-[#080808]"
    >
      {/* Editor Drawer Tool */}
      <VisualControls
        config={config}
        onChange={handleConfigChange}
        isOpen={isEditorOpen}
        onToggle={() => setIsEditorOpen(!isEditorOpen)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Editor Active Indicator Banner */}
      {isEditorOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#FFFFFF] text-[#000000] px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl border border-[#000000]">
          <Move className="w-3.5 h-3.5 animate-pulse text-[#00D2B5]" />
          <span>Editor Activo: Arrastra el elemento o edítalo desde el panel derecho</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* CAPA 0: FONDO DE CIELO                                   */}
      {/* ======================================================== */}
      <div
        ref={skyRef}
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        <img
          src="/assets/hero/fondo-hero-limpio.webp"
          alt="Cielo Atmosférico"
          draggable={false}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top opacity-65 filter brightness-90 contrast-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-transparent to-[#080808]" />
      </div>

      {/* ======================================================== */}
      {/* CAPA 1: NUBES EN MOVIMIENTO CONTINUO (VOX STYLE)         */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden select-none">
        {/* Track 1: Nubes altas lentas (65s infinite seamless loop) */}
        <div
          ref={nubesTrack1Ref}
          className="absolute top-2 left-0 flex w-[200vw] opacity-35"
        >
          <div className="flex w-[100vw] justify-around items-start shrink-0">
            <img src="/assets/hero/nubes_1.webp" alt="Nube" draggable={false} decoding="async" className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_3.webp" alt="Nube" draggable={false} decoding="async" className="w-72 md:w-[28rem] h-auto pointer-events-none pt-6" />
            <img src="/assets/hero/nubes_5.webp" alt="Nube" draggable={false} decoding="async" className="w-64 md:w-[26rem] h-auto pointer-events-none" />
          </div>
          <div className="flex w-[100vw] justify-around items-start shrink-0">
            <img src="/assets/hero/nubes_1.webp" alt="Nube" draggable={false} decoding="async" className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_3.webp" alt="Nube" draggable={false} decoding="async" className="w-72 md:w-[28rem] h-auto pointer-events-none pt-6" />
            <img src="/assets/hero/nubes_5.webp" alt="Nube" draggable={false} decoding="async" className="w-64 md:w-[26rem] h-auto pointer-events-none" />
          </div>
        </div>

        {/* Track 2: Nubes medias con drift dinámico (45s loop) */}
        <div
          ref={nubesTrack2Ref}
          className="absolute top-12 left-0 flex w-[200vw] opacity-45"
        >
          <div className="flex w-[100vw] justify-between items-start shrink-0 px-8">
            <img src="/assets/hero/nubes_2.webp" alt="Nube" draggable={false} decoding="async" className="w-96 md:w-[36rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_4.webp" alt="Nube" draggable={false} decoding="async" className="w-80 md:w-[30rem] h-auto pointer-events-none pt-4" />
          </div>
          <div className="flex w-[100vw] justify-between items-start shrink-0 px-8">
            <img src="/assets/hero/nubes_2.webp" alt="Nube" draggable={false} decoding="async" className="w-96 md:w-[36rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_4.webp" alt="Nube" draggable={false} decoding="async" className="w-80 md:w-[30rem] h-auto pointer-events-none pt-4" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAPA 0.8: RESPLANDOR DEL HORIZONTE (RIM GLOW) - Z: 8      */}
      {/* ======================================================== */}
      <div className="absolute inset-x-0 bottom-[16vh] md:bottom-[24vh] h-[28vh] md:h-[36vh] z-8 pointer-events-none select-none overflow-hidden">
        {/* Glow cálido / crepuscular ámbar y violeta */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,160,50,0.18)_0%,rgba(130,40,210,0.1)_45%,transparent_75%)] mix-blend-screen" />
        {/* Pulsación luminosa sutil */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(0,210,181,0.09)_0%,transparent_65%)] mix-blend-screen animate-pulse duration-1000" />
      </div>

      {/* ======================================================== */}
      {/* CAPA 2: EDIFICIOS DEL FONDO (edificios02 - ESPEJO TRIPLET) */}
      {/* ======================================================== */}
      <div
        onMouseDown={(e) => startDrag('edificiosBack', e)}
        onTouchStart={(e) => startDrag('edificiosBack', e)}
        onClick={() => isEditorOpen && setActiveTab('edificiosBack')}
        style={{
          transform: `translate(${config.edificiosBack.x}px, ${-config.edificiosBack.y}px) scale(${config.edificiosBack.scale}) rotate(${config.edificiosBack.rotation}deg)`,
          opacity: config.edificiosBack.opacity / 100,
          zIndex: isEditorOpen && activeTab === 'edificiosBack' ? 26 : 10,
        }}
        className={`absolute inset-x-0 bottom-0 flex items-end justify-start select-none overflow-hidden transition-shadow ${
          isEditorOpen
            ? `cursor-grab active:cursor-grabbing ${
                activeTab === 'edificiosBack'
                  ? 'ring-2 ring-[#00D2B5] shadow-[0_0_25px_rgba(0,210,181,0.5)] pointer-events-auto'
                  : 'pointer-events-auto hover:ring-1 hover:ring-[#00D2B5]/50'
              }`
            : 'pointer-events-none'
        }`}
      >
        <div
          ref={edificiosBackParallaxRef}
          className="flex items-end justify-start shrink-0 w-max select-none pointer-events-none will-change-transform"
        >
          <div
            ref={edificiosBackIntroRef}
            className="flex items-end shrink-0 w-max select-none pointer-events-none will-change-transform filter contrast-110 brightness-95"
          >
            <div
              ref={edificiosBackMarqueeRef}
              className="flex items-end shrink-0 select-none pointer-events-none will-change-transform animate-marquee-back"
            >
              {(isMobile ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7]).map((idx) => {
                const isMirrored = idx % 2 === 1;
                return (
                  <img
                    key={idx}
                    src="/assets/hero/edificios02.webp"
                    alt={`Edificios Fondo ${isMirrored ? 'Espejo' : ''}`}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className={`h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom pointer-events-none select-none ${
                      isMirrored ? 'scale-x-[-1] -ml-px' : idx > 0 ? '-ml-px' : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>
      </div>
        {isEditorOpen && activeTab === 'edificiosBack' && (
          <div className="absolute top-4 left-6 bg-[#00D2B5] text-[#000000] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono shadow-md">
            CAPA SELECCIONADA: EDIFICIOS FONDO (02) - TRIPLET ESPEJO
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CAPA 2.5: NEBLINA INTERMEDIA (PERSPECTIVA AÉREA) - Z: 12   */}
      {/* Camufla el horizonte entre edificios02 y edificios01     */}
      {/* ======================================================== */}
      <div className="absolute inset-x-0 bottom-0 z-12 pointer-events-none select-none overflow-hidden h-[40vh] md:h-[44vh]">
        {/* Velo atmosférico suave con blend screen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09111a]/75 via-[#101b26]/30 to-transparent mix-blend-screen" />

        {/* Tira de niebla difusa en deriva continua */}
        <div
          ref={mistTrack1Ref}
          className="absolute inset-0 flex w-[200vw] opacity-40 mix-blend-screen pointer-events-none"
        >
          <div className="w-[100vw] h-full shrink-0 bg-[radial-gradient(ellipse_at_bottom,rgba(165,195,225,0.3)_0%,transparent_70%)]" />
          <div className="w-[100vw] h-full shrink-0 bg-[radial-gradient(ellipse_at_bottom,rgba(165,195,225,0.3)_0%,transparent_70%)]" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAPA 3: YAPE-PERSONA GIGANTE (CAPA INTERMEDIA) - Z: 15    */}
      {/* ======================================================== */}
      {/* CAPA 3: YAPE-PERSONA GIGANTE (CAPA INTERMEDIA) - Z: 15    */}
      {/* Se sitúa estrictamente POR ENCIMA de edificiosBack (z:10) */}
      {/* y POR DEBAJO de edificiosFront (z:20)                     */}
      {/* ======================================================== */}
      <div
        onMouseDown={(e) => startDrag('yapePerson', e)}
        onTouchStart={(e) => startDrag('yapePerson', e)}
        onClick={() => isEditorOpen && setActiveTab('yapePerson')}
        style={{
          left: isMobile ? '50%' : `${config.yapePerson.x}%`,
          bottom: isMobile ? `${config.yapePerson.y - 6}%` : `${config.yapePerson.y}%`,
          transform: isMobile
            ? `translateX(-50%) scale(${config.yapePerson.scale}) rotate(${config.yapePerson.rotation}deg)`
            : `scale(${config.yapePerson.scale}) rotate(${config.yapePerson.rotation}deg)`,
          opacity: config.yapePerson.opacity / 100,
          zIndex: isEditorOpen && activeTab === 'yapePerson' ? 27 : 15,
        }}
        className={`absolute w-[32rem] sm:w-[34rem] md:w-[26rem] lg:w-[28rem] select-none transition-shadow ${
          isEditorOpen
            ? `cursor-grab active:cursor-grabbing ${
                activeTab === 'yapePerson'
                  ? 'ring-2 ring-[#FFFFFF] shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                  : 'hover:ring-1 hover:ring-[#FFFFFF]/50'
              }`
            : ''
        }`}
      >
        <div ref={yapeParallaxRef} className="w-full h-full relative will-change-transform">
          <div ref={yapeIntroRef} className="w-full h-full relative will-change-transform">
            <div ref={yapeFloatRef} className="w-full h-full relative will-change-transform">
              <img
                src="/assets/hero/yape-persona.webp"
                alt="Yape Superhéroe"
                draggable={false}
                loading="eager"
                decoding="async"
                className="w-full h-auto shadow-cutout transition-transform duration-200 pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
        {isEditorOpen && activeTab === 'yapePerson' && (
          <div className="absolute -top-6 left-0 bg-[#FFFFFF] text-[#000000] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono shadow-md">
            CAPA MEDIA: YAPE
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CAPA 3.5: NUBES FLOTANDO POR ENCIMA DE YAPE - Z: 18       */}
      {/* Cruza directamente por el pecho y cuerpo de Yape          */}
      {/* ======================================================== */}
      <div className="absolute inset-x-0 bottom-[8vh] md:bottom-[18vh] z-18 pointer-events-none overflow-hidden select-none">
        <div
          ref={nubesOverYapeRef}
          className="flex w-[200vw] opacity-60 mix-blend-screen pointer-events-none"
        >
          <div className="flex w-[100vw] justify-around items-center shrink-0">
            <img src="/assets/hero/nubes_4.webp" alt="Nube sobre Yape" draggable={false} decoding="async" className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_2.webp" alt="Nube sobre Yape" draggable={false} decoding="async" className="w-96 md:w-[36rem] h-auto pointer-events-none pt-6" />
          </div>
          <div className="flex w-[100vw] justify-around items-center shrink-0">
            <img src="/assets/hero/nubes_4.webp" alt="Nube sobre Yape" draggable={false} decoding="async" className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_2.webp" alt="Nube sobre Yape" draggable={false} decoding="async" className="w-96 md:w-[36rem] h-auto pointer-events-none pt-6" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAPA 4: EDIFICIOS DEL FRENTE (edificios01 - ESPEJO TRIPLET) */}
      {/* Cubren los pies de yapePerson para dar profundidad       */}
      {/* ======================================================== */}
      <div
        onMouseDown={(e) => startDrag('edificiosFront', e)}
        onTouchStart={(e) => startDrag('edificiosFront', e)}
        onClick={() => isEditorOpen && setActiveTab('edificiosFront')}
        style={{
          transform: `translate(${config.edificiosFront.x}px, ${-config.edificiosFront.y}px) scale(${config.edificiosFront.scale}) rotate(${config.edificiosFront.rotation}deg)`,
          opacity: config.edificiosFront.opacity / 100,
          zIndex: isEditorOpen && activeTab === 'edificiosFront' ? 28 : 20,
        }}
        className={`absolute inset-x-0 bottom-0 flex items-end justify-start select-none overflow-hidden transition-shadow ${
          isEditorOpen
            ? `cursor-grab active:cursor-grabbing ${
                activeTab === 'edificiosFront'
                  ? 'ring-2 ring-[#00D2B5] shadow-[0_0_25px_rgba(0,210,181,0.5)] pointer-events-auto'
                  : 'pointer-events-auto hover:ring-1 hover:ring-[#00D2B5]/50'
              }`
            : 'pointer-events-none'
        }`}
      >
        <div
          ref={edificiosFrontParallaxRef}
          className="flex items-end justify-start shrink-0 w-max select-none pointer-events-none will-change-transform"
        >
          <div
            ref={edificiosFrontIntroRef}
            className="flex items-end shrink-0 w-max select-none pointer-events-none will-change-transform filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)]"
          >
            <div
              ref={edificiosFrontMarqueeRef}
              className="flex items-end shrink-0 select-none pointer-events-none will-change-transform animate-marquee-front"
            >
              {(isMobile ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7]).map((idx) => {
                const isMirrored = idx % 2 === 1;
                return (
                  <img
                    key={idx}
                    src="/assets/hero/edificios01.webp"
                    alt={`Edificios Frente ${isMirrored ? 'Espejo' : ''}`}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className={`h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom pointer-events-none select-none ${
                      isMirrored ? 'scale-x-[-1] -ml-px' : idx > 0 ? '-ml-px' : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>
      </div>
        {isEditorOpen && activeTab === 'edificiosFront' && (
          <div className="absolute top-4 right-6 bg-[#00D2B5] text-[#000000] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono shadow-md">
            CAPA SELECCIONADA: EDIFICIOS FRENTE (01) - TRIPLET ESPEJO
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CAPA 4.5: NEBLINA DE CIMIENTOS Y FUNDIDO AL PISO - Z: 22  */}
      {/* Camufla el corte inferior de los edificios con el stage  */}
      {/* ======================================================== */}
      <div className="absolute inset-x-0 bottom-0 z-22 pointer-events-none select-none overflow-hidden h-[16vh] md:h-[30vh]">
        {/* Fundido profundo hacia el fondo del stage */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />

        {/* Niebla baja de suelo a nivel de calle en deriva inversa */}
        <div
          ref={mistTrack2Ref}
          className="absolute inset-0 flex w-[200vw] -left-[100vw] opacity-30 mix-blend-screen pointer-events-none"
        >
          <div className="w-[100vw] h-full shrink-0 bg-[radial-gradient(ellipse_at_bottom,rgba(210,225,240,0.22)_0%,transparent_60%)]" />
          <div className="w-[100vw] h-full shrink-0 bg-[radial-gradient(ellipse_at_bottom,rgba(210,225,240,0.22)_0%,transparent_60%)]" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAPA 5: MOTAS & PARTÍCULAS ATMOSFÉRICAS - Z: 25           */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-25 pointer-events-none select-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/45 shadow-[0_0_8px_rgba(255,255,255,0.75)] animate-mote-float"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 17) % 94}%`,
              top: `${(i * 21) % 86}%`,
              animationDelay: `${(i * 0.6) % 5}s`,
              animationDuration: `${5.5 + (i % 5) * 1.8}s`,
              opacity: 0.15 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>

      {/* ======================================================== */}
      {/* CAPA 5.5: VIÑETA LATERAL Y BLENDING DE BORDES - Z: 28     */}
      {/* Camufla los laterales para que el panorama respire       */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-28 pointer-events-none select-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(8,8,8,0.75)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-3 sm:w-16 md:w-48 z-28 pointer-events-none select-none bg-gradient-to-r from-[#080808] via-[#080808]/50 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-3 sm:w-16 md:w-48 z-28 pointer-events-none select-none bg-gradient-to-l from-[#080808] via-[#080808]/50 to-transparent" />

      {/* ======================================================== */}
      {/* CAPA 6: TITULAR EDITORIAL Y CUERPO (UI / Z: 30)          */}
      {/* ======================================================== */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-1 flex items-start md:items-center justify-center md:justify-end pt-10 pb-4 md:py-12 pointer-events-none">
        <div
          onMouseDown={(e) => startDrag('textBlock', e)}
          onTouchStart={(e) => startDrag('textBlock', e)}
          onClick={() => isEditorOpen && setActiveTab('textBlock')}
          style={{
            transform: `translate(${config.textBlock.x}px, ${-config.textBlock.y}px) scale(${config.textBlock.scale})`,
            opacity: config.textBlock.opacity / 100,
          }}
          className={`hero-text-content w-full md:w-7/12 lg:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-5 sm:px-8 md:px-0 md:pl-6 pointer-events-auto ${
            isEditorOpen
              ? `cursor-grab active:cursor-grabbing ${
                  activeTab === 'textBlock'
                    ? 'ring-2 ring-[#00D2B5] shadow-[0_0_20px_rgba(0,210,181,0.5)] p-2'
                    : 'hover:ring-1 hover:ring-[#FFFFFF]/50 p-2'
                }`
              : ''
          }`}
        >
          {/* Monumental Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#FFFFFF] leading-[1.08] md:leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
            <span className="hero-headline-chunk block will-change-transform">EL IMPERIO</span>
            <span className="hero-headline-chunk block will-change-transform">QUE CASI</span>
            <span className="hero-headline-chunk block text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#EAEAEA] to-[#888888] will-change-transform">
              MUERE EN 72 HORAS:
            </span>
          </h1>

          {/* Subtítulo Periodístico Editorial */}
          <p className="hero-subtext-chunk mt-3.5 md:mt-4 text-sm sm:text-base md:text-lg text-[#EAEAEA] max-w-sm md:max-w-xl font-body font-normal leading-snug md:leading-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)] will-change-transform tracking-tight">
            «La historia secreta detrás de <span className="text-[#FFFFFF] font-semibold">YAPE</span>, la app de pagos que mueve más dinero que los bancos más grandes del Perú»
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INDICADOR DE SCROLL EDITORIAL MINIMALISTA - Z: 30        */}
      {/* ======================================================== */}
      <div
        className={`hero-scroll-cue absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-1.5 pointer-events-none select-none transition-opacity duration-300 ${
          hasScrolled ? 'opacity-0' : 'opacity-80 hover:opacity-100'
        }`}
      >
        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-[#D0D0CE]/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Scroll para descubrir
        </span>
        <div className="w-px h-5 md:h-7 bg-gradient-to-b from-[#FFFFFF] via-[#00D2B5] to-transparent animate-pulse" />
      </div>
    </section>
  );
};
