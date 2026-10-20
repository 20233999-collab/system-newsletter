import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, ArrowRight, Cpu, Radio, ShieldCheck } from 'lucide-react';

export const ComingSoonSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    'Sincronizando telemetría del incidente (AWS us-east-1)...',
    'Reconstruyendo arquitectura de colapso en PostgreSQL...',
    'Descifrando 48 testimonios técnicos de infraestructura...',
    'Compilando lecciones de resiliencia y rescate core...',
    'Aplicando protocolo de revisión editorial final...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [logs.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <section
      id="seccion-colapso"
      className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between overflow-hidden py-24 select-none"
    >
      {/* Fondo técnico: rejilla sutil y gradiente de luz dorada ambiental */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-[#FFD700]/[0.035] blur-[140px] rounded-full pointer-events-none" />

      {/* Marquee superior de cinta perimétrica */}
      <div className="w-full overflow-hidden border-y border-white/[0.06] bg-black/40 backdrop-blur-md py-2.5 z-10">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] tracking-[0.25em] text-white/50 uppercase">
          <span className="mx-4">/// ARCHIVO CONFIDENCIAL // EXPEDIENTE 02: EL COLAPSO SILENCIOSO ///</span>
          <span className="mx-4 text-[#FFD700]">● ACCESO RESTRINGIDO</span>
          <span className="mx-4">/// NO APAGAR LA TERMINAL ///</span>
          <span className="mx-4">/// COMPILACIÓN AL 88.4% ///</span>
          <span className="mx-4">/// ARCHIVO CONFIDENCIAL // EXPEDIENTE 02: EL COLAPSO SILENCIOSO ///</span>
          <span className="mx-4 text-[#FFD700]">● ACCESO RESTRINGIDO</span>
          <span className="mx-4">/// NO APAGAR LA TERMINAL ///</span>
          <span className="mx-4">/// COMPILACIÓN AL 88.4% ///</span>
        </div>
      </div>

      {/* Contenido Central */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        
        {/* Badge de estado con pulso */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 transition-transform hover:scale-105">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
          </span>
          <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-[#FFD700] uppercase font-semibold">
            FASE DE DESCLASIFICACIÓN // OCTUBRE 2026
          </span>
        </div>

        {/* Titular Monumental */}
        <div className="relative mb-6">
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase font-display bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30 leading-none">
            PRÓXIMAMENTE
          </h2>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-80" />
        </div>

        {/* Subtítulo Narrativo Editorial */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl font-light italic leading-relaxed mb-12">
          &ldquo;Las 72 horas que casi apagan el país: el informe de ingeniería detrás del mayor rescate en la nube del Perú.&rdquo;
        </p>

        {/* Tarjeta de Terminal Técnica con logs en vivo */}
        <div className="w-full max-w-xl bg-black/60 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-5 sm:p-6 text-left shadow-2xl relative overflow-hidden mb-12 group hover:border-[#FFD700]/30 transition-all">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="font-mono text-[11px] text-white/40 ml-2">core-incident-telemetry.sh</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 font-mono text-[10px]">
              <Cpu className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>SYNC: LIVE</span>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs text-white/70 min-h-[52px] flex flex-col justify-center">
            <div className="flex items-center gap-2 text-white/40 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>STATUS: COMPILING DISCLOSURE LOGS</span>
            </div>
            <div className="text-white/90 flex items-center gap-2 pl-2 border-l border-[#FFD700]/50 transition-all duration-300">
              <span className="text-[#FFD700]">&gt;</span>
              <span className="truncate">{logs[logIndex]}</span>
            </div>
          </div>

          {/* Barra de progreso de compilación */}
          <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>PROGRESO DE DESCLASIFICACIÓN</span>
            <span className="text-[#FFD700] font-semibold">88.4%</span>
          </div>
          <div className="w-full bg-white/[0.05] h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-[#FFD700] to-yellow-200 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '88.4%' }}
            />
          </div>
        </div>

        {/* Formulario / CTA de Notificación */}
        <div className="w-full max-w-md">
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] font-mono text-xs tracking-wider animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
              <span>CREDENCIAL REGISTRADA. TE AVISAREMOS PRIMERO.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduce tu correo electrónico..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono placeholder:text-white/30 text-white focus:outline-none focus:border-[#FFD700]/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#FFD700] hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider font-mono uppercase flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FFD700]/10 cursor-pointer"
              >
                <span>Notificarme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
          <p className="font-mono text-[10px] text-white/30 mt-3 tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#FFD700]/60" />
            <span>SIN SPAM. ÚNICAMENTE EL AVISO DEL CAPÍTULO 02 AL DESCLASIFICARSE.</span>
          </p>
        </div>

      </div>

      {/* Marquee inferior de cierre */}
      <div className="w-full overflow-hidden border-y border-white/[0.06] bg-black/40 backdrop-blur-md py-2.5 z-10 mt-12">
        <div className="flex whitespace-nowrap animate-marquee-reverse font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
          <span className="mx-4 flex items-center gap-1.5"><Radio className="w-3 h-3 text-[#FFD700]" /> SISTEMA NEWSLETTER © 2026</span>
          <span className="mx-4 text-white/20">•</span>
          <span className="mx-4">CRÓNICAS DE INGENIERÍA & PRODUCTO</span>
          <span className="mx-4 text-white/20">•</span>
          <span className="mx-4 text-[#FFD700]">YAPE // REPORTE ESPECIAL</span>
          <span className="mx-4 text-white/20">•</span>
          <span className="mx-4">SISTEMA NEWSLETTER © 2026</span>
          <span className="mx-4 text-white/20">•</span>
          <span className="mx-4">CRÓNICAS DE INGENIERÍA & PRODUCTO</span>
          <span className="mx-4 text-white/20">•</span>
          <span className="mx-4 text-[#FFD700]">YAPE // REPORTE ESPECIAL</span>
        </div>
      </div>
    </section>
  );
};
