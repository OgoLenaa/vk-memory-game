export const achievements = [
  { id: 'first_win', icon: '🏅', title: 'Первая победа', description: 'Выиграй первую партию' },
  { id: 'five_wins', icon: '🌟', title: 'Пять побед', description: 'Выиграй 5 партий' },
  { id: 'ten_wins', icon: '🏆', title: 'Мастер памяти', description: 'Выиграй 10 партий' },
  { id: 'hard_win', icon: '💎', title: 'Сложный вызов', description: 'Победи на сложном уровне' },
  { id: 'perfect_easy', icon: '🎯', title: 'Идеальная память', description: 'Победи на лёгком уровне за 4 хода' },
];

export const earnedAchievements = (existing, { wins, level, moves }) => {
  const earned = new Set(existing);
  if (wins >= 1) earned.add('first_win');
  if (wins >= 5) earned.add('five_wins');
  if (wins >= 10) earned.add('ten_wins');
  if (level === 'hard') earned.add('hard_win');
  if (level === 'easy' && moves === 4) earned.add('perfect_easy');
  return [...earned];
};
