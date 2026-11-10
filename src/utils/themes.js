export const themes = {
  amethyst: {
    name: 'Аметист',
    icon: '💜',
    description: 'Классическое фиолетовое оформление',
    background: 'linear-gradient(160deg, #171329, #0e0b19)',
    surface: '#241b38',
    accent: '#8055d9',
    text: '#d8c7ff',
  },
  ocean: {
    name: 'Океан',
    icon: '🌊',
    description: 'Спокойные бирюзовые оттенки',
    background: 'linear-gradient(160deg, #123039, #08191f)',
    surface: '#173b43',
    accent: '#218e8b',
    text: '#a4e4dc',
  },
  sunset: {
    name: 'Закат',
    icon: '🌅',
    description: 'Тёплые янтарные оттенки',
    background: 'linear-gradient(160deg, #38241c, #1e1413)',
    surface: '#4a3026',
    accent: '#c47740',
    text: '#ffd5ad',
  },
};

export const DEFAULT_THEME = 'amethyst';
export const THEME_STORAGE_KEY = 'memoryGameTheme';

export const readTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved && Object.hasOwn(themes, saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};
