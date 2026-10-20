import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Secciones de la historia (máximo 2 palabras, simples)
const SECTIONS = [
  { id: 'seccion-hero', label: '01 // INICIO' },
  { id: 'seccion-intro', label: '02 // PRÓLOGO' },
  { id: 'seccion-colapso', label: '03 // COLAPSO' },
  { id: 'seccion-rescate', label: '04 // RESCATE' },
  { id: 'seccion-imperio', label: '05 // IMPERIO' },
];

export const UpperBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false); // Visibilidad global (solo fuera del hero)
  const [isOpen, setIsOpen] = useState(false); // Despliegue de la barra (por hover o tap)
  const [activeSection, setActiveSection] = useState('seccion-hero');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = window.innerHeight * 0.75;

          // Ocultar completamente mientras se está en el Hero
          setIsVisible(scrollY > heroHeight);

          // Scroll Spy optimizado: Detectar sección activa
          if (scrollY < heroHeight) {
            setActiveSection('seccion-hero');
          } else {
            const sections = ['seccion-colapso', 'seccion-intro'];
            for (const id of sections) {
              const elem = document.getElementById(id);
              if (elem) {
                const rect = elem.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.55 && rect.bottom >= window.innerHeight * 0.2) {
                  setActiveSection(id);
                  break;
                }
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'seccion-hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Zona caliente de Hover en el tope superior (primeros 40px) */}
      <div
        onMouseEnter={() => setIsOpen(true)}
        className="fixed top-0 inset-x-0 h-10 z-40 pointer-events-auto"
      />

      {/* Flechita / Trigger central visible en todo momento fuera del Hero */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-transform duration-300"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          type="button"
          aria-label="Abrir barra de navegación"
          className="group flex items-center justify-center w-10 h-4.5 rounded-b-xl border-b border-x border-white/15 bg-black/50 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-[#FFD700]/50 hover:bg-black/80 transition-all cursor-pointer"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/70 group-hover:text-[#FFD700] transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#FFD700]' : 'animate-bounce'
            }`}
          />
        </button>
      </div>

      {/* Barra superior casi transparente desplegable */}
      <header
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full bg-[#080808]/40 backdrop-blur-xl border-b border-white/10 px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
          {/* 1. Izquierda: Logo (Yape + Sello Editorial) */}
          <div
            onClick={() => scrollToSection('seccion-hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 p-0.5 bg-black/60 group-hover:border-[#FFD700]/70 transition-colors shadow-sm">
              <img
                src="/assets/hero/yape-persona.webp"
                alt="Yape Logo"
                className="w-full h-full object-contain filter contrast-125"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-tight text-white group-hover:text-[#FFD700] transition-colors leading-none">
                YAPE <span className="text-[#00D2B5] font-light">//</span> REPORT
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/40 leading-tight">
                CRÓNICAS DIGITALES
              </span>
            </div>
          </div>

          {/* 2. Centro: Redes Sociales (Íconos minimalistas con hover amarillo oro) */}
          <div className="hidden md:flex items-center gap-5 text-white/80">
            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="text-white/70 hover:text-[#FFD700] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-white/70 hover:text-[#FFD700] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-white/70 hover:text-[#FFD700] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74V9.94H5.06v8.56z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white/70 hover:text-[#FFD700] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>

          {/* 3. Derecha: Secciones / Scroll Spy (Títulos de máx 2 palabras) */}
          <nav className="flex items-center gap-1.5 sm:gap-3 text-xs font-display">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`px-2 py-1 rounded-md transition-all text-[11px] sm:text-xs tracking-tight flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#FFD700] font-bold bg-[#FFD700]/10 shadow-[0_0_12px_rgba(255,215,0,0.2)]'
                      : 'text-white/45 hover:text-white/90 hover:bg-white/5 font-medium'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                  )}
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};

export default UpperBar;
