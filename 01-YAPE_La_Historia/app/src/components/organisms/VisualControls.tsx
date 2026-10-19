import React from 'react';
import { type HeroVisualConfig, DEFAULT_HERO_CONFIG } from '../../utils/visualConfig';
import { Sliders, RotateCcw, Copy, Check, Eye } from 'lucide-react';

interface VisualControlsProps {
  config: HeroVisualConfig;
  onChange: (newConfig: HeroVisualConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: keyof HeroVisualConfig;
  onSelectTab: (tab: keyof HeroVisualConfig) => void;
}

export const VisualControls: React.FC<VisualControlsProps> = ({
  config,
  onChange,
  isOpen,
  onToggle,
  activeTab,
  onSelectTab,
}) => {
  const [copied, setCopied] = React.useState(false);

  const updateProp = (
    key: keyof HeroVisualConfig,
    prop: keyof HeroVisualConfig['yapePerson'],
    val: number
  ) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        [prop]: val,
      },
    });
  };

  const nudge = (
    key: keyof HeroVisualConfig,
    prop: keyof HeroVisualConfig['yapePerson'],
    delta: number
  ) => {
    const current = config[key][prop];
    const updated = Math.round((current + delta) * 100) / 100;
    updateProp(key, prop, updated);
  };

  const resetAll = () => {
    onChange(DEFAULT_HERO_CONFIG);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBuildingTab = activeTab === 'edificiosBack' || activeTab === 'edificiosFront';

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-[#111111] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#333333] hover:border-[#FFFFFF] px-3 py-2 md:px-4 md:py-2.5 font-mono text-[10px] md:text-xs uppercase tracking-wider shadow-2xl transition-all duration-200 cursor-pointer"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>{isOpen ? 'Cerrar Editor' : 'Editor Visual'}</span>
      </button>

      {/* Editor Drawer */}
      {isOpen && (
        <aside className="fixed top-16 md:top-20 left-3 right-3 md:left-auto md:right-6 z-50 md:w-96 max-h-[78vh] md:max-h-[82vh] flex flex-col bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2E2E2E] shadow-2xl text-[#FFFFFF] font-mono p-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00D2B5]">
              <Eye className="w-4 h-4" />
              <span>Ajuste en Vivo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={resetAll}
                title="Reiniciar a valores por defecto"
                className="p-1.5 hover:bg-[#222222] text-[#888888] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={copyJson}
                title="Copiar JSON para el agente"
                className="flex items-center gap-1 text-[10px] bg-[#1A1A1A] hover:bg-[#FFFFFF] text-[#E0E0E0] hover:text-[#000000] border border-[#333333] px-2 py-1 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#00D2B5]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar Config'}</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-[#888888] mb-3 leading-normal font-body">
            Arrastra directamente en la pantalla o usa los botones y sliders. Selecciona la capa que deseas mover.
          </p>

          {/* Element Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 mb-4 text-[10px]">
            {(
              [
                ['edificiosBack', 'Edif. Fondo (02)'],
                ['yapePerson', 'Yape (Capa Media)'],
                ['edificiosFront', 'Edif. Frente (01)'],
                ['textBlock', 'Texto Editorial'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onSelectTab(key)}
                className={`py-1.5 px-2 text-center border transition-all cursor-pointer ${
                  activeTab === key
                    ? 'border-[#00D2B5] bg-[#00D2B5] text-[#000000] font-bold shadow-[0_0_10px_rgba(0,210,181,0.4)]'
                    : 'border-[#222222] bg-[#111111] text-[#888888] hover:text-[#FFFFFF]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active Element Sliders & Step Buttons */}
          <div className="space-y-4 text-[11px]">
            {/* Posición Horizontal */}
            <div className="bg-[#141414] p-2.5 border border-[#222222]">
              <div className="flex justify-between items-center text-[#888888] mb-1.5">
                <span>Posición Horizontal (X {isBuildingTab ? 'px' : '%'})</span>
                <input
                  type="number"
                  value={config[activeTab].x}
                  onChange={(e) => updateProp(activeTab, 'x', Number(e.target.value))}
                  className="w-16 bg-[#000000] border border-[#333333] text-right px-1.5 py-0.5 text-[#00D2B5] font-bold text-xs"
                />
              </div>
              <input
                type="range"
                min={isBuildingTab ? -800 : -50}
                max={isBuildingTab ? 800 : 150}
                value={config[activeTab].x}
                onChange={(e) => updateProp(activeTab, 'x', Number(e.target.value))}
                className="w-full accent-[#00D2B5] bg-[#222222] cursor-pointer"
              />
              <div className="flex justify-between gap-1 mt-1.5">
                {[-50, -10, -1, 1, 10, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => nudge(activeTab, 'x', step)}
                    className="flex-1 py-1 text-[9px] bg-[#1E1E1E] hover:bg-[#333333] text-[#AAAAAA] hover:text-[#FFFFFF] border border-[#2A2A2A] text-center cursor-pointer"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* Posición Vertical */}
            <div className="bg-[#141414] p-2.5 border border-[#222222]">
              <div className="flex justify-between items-center text-[#888888] mb-1.5">
                <span>Posición Vertical (Y / Altura {isBuildingTab ? 'px' : '%'})</span>
                <input
                  type="number"
                  value={config[activeTab].y}
                  onChange={(e) => updateProp(activeTab, 'y', Number(e.target.value))}
                  className="w-16 bg-[#000000] border border-[#333333] text-right px-1.5 py-0.5 text-[#00D2B5] font-bold text-xs"
                />
              </div>
              <input
                type="range"
                min={isBuildingTab ? -600 : -40}
                max={isBuildingTab ? 800 : 120}
                value={config[activeTab].y}
                onChange={(e) => updateProp(activeTab, 'y', Number(e.target.value))}
                className="w-full accent-[#00D2B5] bg-[#222222] cursor-pointer"
              />
              <div className="flex justify-between gap-1 mt-1.5">
                {[-50, -10, -1, 1, 10, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => nudge(activeTab, 'y', step)}
                    className="flex-1 py-1 text-[9px] bg-[#1E1E1E] hover:bg-[#333333] text-[#AAAAAA] hover:text-[#FFFFFF] border border-[#2A2A2A] text-center cursor-pointer"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* Escala */}
            <div className="bg-[#141414] p-2.5 border border-[#222222]">
              <div className="flex justify-between items-center text-[#888888] mb-1.5">
                <span>Escala (Tamaño)</span>
                <span className="text-[#00D2B5] font-bold">{config[activeTab].scale}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="3"
                step="0.05"
                value={config[activeTab].scale}
                onChange={(e) => updateProp(activeTab, 'scale', Number(e.target.value))}
                className="w-full accent-[#00D2B5] bg-[#222222] cursor-pointer"
              />
              <div className="flex justify-between gap-1 mt-1.5">
                {[-0.2, -0.05, 0.05, 0.2].map((step) => (
                  <button
                    key={step}
                    onClick={() => nudge(activeTab, 'scale', step)}
                    className="flex-1 py-1 text-[9px] bg-[#1E1E1E] hover:bg-[#333333] text-[#AAAAAA] hover:text-[#FFFFFF] border border-[#2A2A2A] text-center cursor-pointer"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotación */}
            <div className="bg-[#141414] p-2.5 border border-[#222222]">
              <div className="flex justify-between items-center text-[#888888] mb-1.5">
                <span>Rotación</span>
                <span className="text-[#00D2B5] font-bold">{config[activeTab].rotation}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={config[activeTab].rotation}
                onChange={(e) => updateProp(activeTab, 'rotation', Number(e.target.value))}
                className="w-full accent-[#00D2B5] bg-[#222222] cursor-pointer"
              />
            </div>

            {/* Opacidad */}
            <div className="bg-[#141414] p-2.5 border border-[#222222]">
              <div className="flex justify-between items-center text-[#888888] mb-1.5">
                <span>Opacidad</span>
                <span className="text-[#00D2B5] font-bold">{config[activeTab].opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={config[activeTab].opacity}
                onChange={(e) => updateProp(activeTab, 'opacity', Number(e.target.value))}
                className="w-full accent-[#00D2B5] bg-[#222222] cursor-pointer"
              />
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
