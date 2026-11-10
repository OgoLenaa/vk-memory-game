export const achievements = [
  { id: 'first_win', icon: '🏅', title: 'Первая победа', description: 'Выиграй первую партию' },
  { id: 'five_wins', icon: '🌟', title: 'Пять побед', description: 'Выиграй 5 партий' },
  { id: 'ten_wins', icon: '🏆', title: 'Мастер памяти', description: 'Выиграй 10 партий' },
  { id: 'twenty_five_wins', icon: '👑', title: 'Легенда памяти', description: 'Выиграй 25 партий' },
  { id: 'fifty_wins', icon: '🔥', title: 'Непобедимый', description: 'Выиграй 50 партий' },
  { id: 'hard_win', icon: '💎', title: 'Сложный вызов', description: 'Победи на сложном уровне' },
  { id: 'perfect_easy', icon: '🎯', title: 'Идеальная память', description: 'Победи на лёгком уровне за 4 хода' },
];

export const earnedAchievements = (existing, { wins, level, moves }) => {
  const earned = new Set(existing);
  if (wins >= 1) earned.add('first_win');
  if (wins >= 5) earned.add('five_wins');
  if (wins >= 10) earned.add('ten_wins');
  if (wins >= 25) earned.add('twenty_five_wins');
  if (wins >= 50) earned.add('fifty_wins');
  if (level === 'hard') earned.add('hard_win');
  if (level === 'easy' && moves === 4) earned.add('perfect_easy');
  return [...earned];
};

export const achievementProgress = (id, stats) => {
  const targets = { first_win: 1, five_wins: 5, ten_wins: 10, twenty_five_wins: 25, fifty_wins: 50 };
  const target = targets[id];
  if (!target) return null;
  return { current: Math.min(Math.max(0, stats?.wins || 0), target), target };
};
