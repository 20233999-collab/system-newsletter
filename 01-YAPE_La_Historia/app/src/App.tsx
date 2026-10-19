import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { HeroStage } from './components/organisms/HeroStage';

export const App: React.FC = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll as per trevornoah.com / Awwwards standard
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#080808] text-[#F6F6F4] flex flex-col font-body selection:bg-[#FFFFFF] selection:text-[#000000]">
      <main className="h-full w-full flex flex-col">
        {/* Milestone 1: Hero Stage Collage Showcase */}
        <HeroStage />
      </main>
    </div>
  );
};

export default App;
