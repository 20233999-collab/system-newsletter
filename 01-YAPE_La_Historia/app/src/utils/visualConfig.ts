export interface ElementConfig {
  x: number; // percentage of viewport or px
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface HeroVisualConfig {
  yapePerson: ElementConfig;
  billete100: ElementConfig;
  edificiosFront: ElementConfig;
  edificiosBack: ElementConfig;
  textBlock: ElementConfig;
}

export const DEFAULT_HERO_CONFIG: HeroVisualConfig = {
  yapePerson: {
    x: 12,
    y: 7,
    scale: 1.15,
    rotation: 0,
    opacity: 100,
  },
  billete100: {
    x: 78,
    y: 22,
    scale: 1,
    rotation: 12,
    opacity: 100,
  },
  edificiosFront: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 100,
  },
  edificiosBack: {
    x: 0,
    y: 40,
    scale: 1.02,
    rotation: 0,
    opacity: 90,
  },
  textBlock: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 100,
  },
};

const STORAGE_KEY = 'yape_hero_visual_config_v4';

export function loadHeroConfig(): HeroVisualConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_CONFIG;
    return { ...DEFAULT_HERO_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_HERO_CONFIG;
  }
}

export function saveHeroConfig(config: HeroVisualConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save hero visual config', err);
  }
}
