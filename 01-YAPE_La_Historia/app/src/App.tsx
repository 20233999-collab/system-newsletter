import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroStage } from './components/organisms/HeroStage';
import { IntroManifestoSection } from './components/organisms/IntroManifestoSection';
import { UpperBar } from './components/organisms/UpperBar';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#080808] text-[#F6F6F4] flex flex-col font-body selection:bg-[#FFFFFF] selection:text-[#000000]">
      {/* Upper Bar: Navegación flotante interactiva con hover trigger y scroll spy */}
      <UpperBar />

      <main className="w-full flex flex-col">
        {/* Milestone 1: Hero Stage Collage Showcase */}
        <HeroStage />

        {/* Milestone 2: Intro en Fondo Negro con Scroll-Scrubbed Reveal */}
        <IntroManifestoSection />
      </main>
    </div>
  );
};

export default App;
