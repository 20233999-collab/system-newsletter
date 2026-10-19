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
  const edificiosBackMarqueeRef = useRef<HTMLDivElement>(null);
  const yapeParallaxRef = useRef<HTMLDivElement>(null);
  const yapeFloatRef = useRef<HTMLDivElement>(null);
  const edificiosFrontParallaxRef = useRef<HTMLDivElement>(null);
  const edificiosFrontMarqueeRef = useRef<HTMLDivElement>(null);

  // Visual Interactive Config State (Persisted in localStorage)
  const [config, setConfig] = useState<HeroVisualConfig>(loadHeroConfig);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof HeroVisualConfig>('edificiosBack');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [hasScrolled, setHasScrolled] = useState(false);

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
      // Parallax mouse position
      if ('clientX' in e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x, y });
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
      gsap.to(nubesTrack1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 65,
        repeat: -1,
      });

      // Nubes Track 2: medium altitude dynamic drift (45s infinite seamless loop)
      gsap.to(nubesTrack2Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 45,
        repeat: -1,
      });

      // Nubes pasando por encima de Yape (32s loop continuo)
      gsap.to(nubesOverYapeRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 32,
        repeat: -1,
      });

      // Neblina Track 1: Bruma intermedia horizontal (38s infinite loop)
      gsap.to(mistTrack1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 38,
        repeat: -1,
      });

      // Neblina Track 2: Velo bajo de suelo a contraviento (28s loop inverso)
      gsap.to(mistTrack2Ref.current, {
        xPercent: 50,
        ease: 'none',
        duration: 28,
        repeat: -1,
      });

      // ========================================================
      // MÓDULO 1: RESPIRACIÓN SUTIL DE YAPE EN SU SITIO (SIN DESPLAZARSE)
      // ========================================================
      gsap.to(yapeFloatRef.current, {
        scaleY: 1.022,
        scaleX: 0.99,
        transformOrigin: 'bottom center',
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // ========================================================
      // MÓDULO 3: INTRO REVEAL CINEMÁTICO AL CARGAR LA PÁGINA
      // ========================================================
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(skyRef.current, {
        opacity: 0,
        duration: 1.2,
      })
      .from([edificiosBackParallaxRef.current, edificiosFrontParallaxRef.current], {
        y: 28,
        opacity: 0.35,
        duration: 1.3,
        stagger: 0.12,
      }, '-=0.8')
      .from(yapeParallaxRef.current, {
        opacity: 0,
        duration: 1,
      }, '-=0.8')
      .from('.hero-headline-chunk', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: 'power2.out',
      }, '-=0.6')
      .from('.hero-scroll-cue', {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.3');
    });

    return () => ctx.revert();
  }, []);

  // Multiplane Cinematic Parallax (Disabled when dragging or on small screens)
  useEffect(() => {
    if (window.innerWidth < 768 || draggingItem.current) return;

    // Sky subtle counter-drift
    gsap.to(skyRef.current, {
      x: mousePos.x * -8,
      y: mousePos.y * -4,
      duration: 1.5,
      ease: 'power2.out',
    });

    // Edificios Fondo (Slowest - distant skyline horizon)
    gsap.to(edificiosBackParallaxRef.current, {
      x: mousePos.x * -16,
      y: mousePos.y * -6,
      duration: 1.4,
      ease: 'power2.out',
    });

    // Yape Persona (Middle layer)
    gsap.to(yapeParallaxRef.current, {
      x: mousePos.x * -28,
      y: mousePos.y * -10,
      duration: 1.25,
      ease: 'power2.out',
    });

    // Edificios Frente (Fastest - foreground camera perspective)
    gsap.to(edificiosFrontParallaxRef.current, {
      x: mousePos.x * -48,
      y: mousePos.y * -16,
      duration: 1.1,
      ease: 'power2.out',
    });
  }, [mousePos]);

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
          src="/assets/hero/fondo-hero-limpio.jpg"
          alt="Cielo Atmosférico"
          draggable={false}
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
            <img src="/assets/hero/nubes_1.png" alt="Nube" draggable={false} className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_3.png" alt="Nube" draggable={false} className="w-72 md:w-[28rem] h-auto pointer-events-none pt-6" />
            <img src="/assets/hero/nubes_5.png" alt="Nube" draggable={false} className="w-64 md:w-[26rem] h-auto pointer-events-none" />
          </div>
          <div className="flex w-[100vw] justify-around items-start shrink-0">
            <img src="/assets/hero/nubes_1.png" alt="Nube" draggable={false} className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_3.png" alt="Nube" draggable={false} className="w-72 md:w-[28rem] h-auto pointer-events-none pt-6" />
            <img src="/assets/hero/nubes_5.png" alt="Nube" draggable={false} className="w-64 md:w-[26rem] h-auto pointer-events-none" />
          </div>
        </div>

        {/* Track 2: Nubes medias con drift dinámico (45s loop) */}
        <div
          ref={nubesTrack2Ref}
          className="absolute top-12 left-0 flex w-[200vw] opacity-45"
        >
          <div className="flex w-[100vw] justify-between items-start shrink-0 px-8">
            <img src="/assets/hero/nubes_2.png" alt="Nube" draggable={false} className="w-96 md:w-[36rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_4.png" alt="Nube" draggable={false} className="w-80 md:w-[30rem] h-auto pointer-events-none pt-4" />
          </div>
          <div className="flex w-[100vw] justify-between items-start shrink-0 px-8">
            <img src="/assets/hero/nubes_2.png" alt="Nube" draggable={false} className="w-96 md:w-[36rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_4.png" alt="Nube" draggable={false} className="w-80 md:w-[30rem] h-auto pointer-events-none pt-4" />
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
            ref={edificiosBackMarqueeRef}
            className="flex items-end shrink-0 select-none pointer-events-none will-change-transform animate-marquee-back"
          >
            {/* Unit 1: 4 tiles seamless */}
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom filter contrast-110 brightness-95 pointer-events-none select-none"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo Espejo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo Espejo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />

            {/* Unit 2: 4 tiles seamless loop duplicate */}
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo Espejo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios02.png"
              alt="Edificios Fondo Espejo"
              draggable={false}
              className="h-[46vh] md:h-[48vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-110 brightness-95 pointer-events-none select-none -ml-px"
            />
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
          <div ref={yapeFloatRef} className="w-full h-full relative will-change-transform">
            <img
              src="/assets/hero/yape-persona.png"
              alt="Yape Superhéroe"
              draggable={false}
              className="w-full h-auto shadow-cutout transition-transform duration-200 pointer-events-none select-none"
            />
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
            <img src="/assets/hero/nubes_4.png" alt="Nube sobre Yape" draggable={false} className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_2.png" alt="Nube sobre Yape" draggable={false} className="w-96 md:w-[36rem] h-auto pointer-events-none pt-6" />
          </div>
          <div className="flex w-[100vw] justify-around items-center shrink-0">
            <img src="/assets/hero/nubes_4.png" alt="Nube sobre Yape" draggable={false} className="w-80 md:w-[32rem] h-auto pointer-events-none" />
            <img src="/assets/hero/nubes_2.png" alt="Nube sobre Yape" draggable={false} className="w-96 md:w-[36rem] h-auto pointer-events-none pt-6" />
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
            ref={edificiosFrontMarqueeRef}
            className="flex items-end shrink-0 select-none pointer-events-none will-change-transform animate-marquee-front"
          >
            {/* Unit 1: 4 tiles seamless */}
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente Espejo"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente Espejo"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />

            {/* Unit 2: 4 tiles seamless loop duplicate */}
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente Espejo"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
            <img
              src="/assets/hero/edificios01.png"
              alt="Edificios Frente Espejo"
              draggable={false}
              className="h-[35vh] md:h-[36vh] w-auto max-w-none object-cover object-bottom scale-x-[-1] filter contrast-125 brightness-95 drop-shadow-[0_-15px_35px_rgba(0,0,0,0.85)] pointer-events-none select-none -ml-px"
            />
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
            <span className="hero-headline-chunk block">EL IMPERIO QUE CASI MUERE</span>
            <span className="hero-headline-chunk block text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#EAEAEA] to-[#888888]">
              EN 72 HORAS:
            </span>
          </h1>

          {/* Sub-headline / Cuerpo */}
          <p className="hero-headline-chunk mt-3.5 md:mt-4 text-xs sm:text-sm md:text-base text-[#D0D0CE] max-w-sm md:max-w-lg font-body font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
            Hoy está instalada en el bolsillo de casi todos, pero en su primer fin de semana de
            lanzamiento fue un <span className="text-[#FFFFFF] underline decoration-[#555555] font-semibold">desastre absoluto</span>.
            Esta no es la historia de una app exitosa; son los desafíos que casi la matan.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INDICADOR DE SCROLL EDITORIAL MINIMALISTA - Z: 30        */}
      {/* ======================================================== */}
      <div
        className={`hero-scroll-cue absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none select-none transition-opacity duration-300 ${
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
