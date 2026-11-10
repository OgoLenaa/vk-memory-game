export const symbols = [
  '🍓', '🚀', '🌙', '🐱', '🎈', '🍀',
  '🍉', '⭐', '🦋', '🍒', '🐼', '🌸',
];

export const themeSymbols = {
  amethyst: symbols,
  ocean: ['🐬', '🐙', '🦀', '🐠', '🐚', '🪼', '🦈', '🐳', '🦭', '🐢', '⚓', '🪸'],
  sunset: ['☀️', '🌻', '🌴', '🍊', '🦋', '🌺', '🌵', '🍹', '🏜️', '🔥', '🌄', '🦜'],
};

export const levels = {
  easy: { name: 'Лёгкий', pairs: 4 },
  medium: { name: 'Средний', pairs: 8 },
  hard: { name: 'Сложный', pairs: 12 },
};

export const createCards = (level, theme = 'amethyst') => {
  const selectedSymbols = (themeSymbols[theme] || symbols).slice(0, levels[level].pairs);
  const shuffled = [...selectedSymbols, ...selectedSymbols];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((symbol, id) => ({ id, symbol }));
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const defaultStats = () => ({
  games: 0,
  wins: 0,
  levels: { easy: 0, medium: 0, hard: 0 },
});

export const readStored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback();
  } catch {
    return fallback();
  }
};
