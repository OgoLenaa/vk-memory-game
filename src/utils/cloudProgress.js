import bridge from '@vkontakte/vk-bridge';
import { defaultStats, readStored } from './memoryGame';
import { earnedAchievements } from './achievements';
import { readTheme } from './themes';

const CLOUD_KEY = 'memoryGameProgressV1';
const LOCAL_KEYS = ['memoryGameRecords', 'memoryGameStats', 'memoryGameAchievements', 'memoryGameTheme'];

export const readLocalProgress = () => ({
  records: readStored(LOCAL_KEYS[0], () => ({})),
  stats: readStored(LOCAL_KEYS[1], defaultStats),
  achievements: readStored(LOCAL_KEYS[2], () => []),
  theme: readTheme(),
});

const count = (value) => Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

// Use the larger counter instead of adding it: the same games may already
// have been saved on both devices. This avoids duplicating victories.
export const mergeProgress = (local, remote) => {
  if (!remote || typeof remote !== 'object') return local;
  const a = local.stats || defaultStats();
  const b = remote.stats || defaultStats();
  const levelKeys = ['easy', 'medium', 'hard'];
  const levels = Object.fromEntries(levelKeys.map((key) =>
    [key, Math.max(count(a.levels?.[key]), count(b.levels?.[key]))]));
  const winsByLevel = Object.fromEntries(levelKeys.map((key) =>
    [key, Math.max(count(a.winsByLevel?.[key]), count(b.winsByLevel?.[key]))]));
  const stats = {
    games: Math.max(count(a.games), count(b.games), ...Object.values(levels)),
    wins: Math.max(count(a.wins), count(b.wins), ...Object.values(winsByLevel)),
    levels,
    winsByLevel,
  };
  const records = {};
  for (const key of levelKeys) {
    const values = [local.records?.[key], remote.records?.[key]]
      .filter((value) => Number.isFinite(value) && value >= 0);
    if (values.length) records[key] = Math.min(...values);
  }
  const achievements = earnedAchievements(
    [...new Set([
      ...(Array.isArray(local.achievements) ? local.achievements : []),
      ...(Array.isArray(remote.achievements) ? remote.achievements : []),
    ])].filter((id) => id !== 'test_reward' && id !== 'test_reward_2'),
    { wins: stats.wins, hardWins: stats.winsByLevel.hard, level: null, moves: null }
  );
  const theme = remote.theme || local.theme || 'amethyst';
  return { records, stats, achievements, theme };
};

export const writeLocalProgress = ({ records, stats, achievements, theme }) => {
  localStorage.setItem(LOCAL_KEYS[0], JSON.stringify(records));
  localStorage.setItem(LOCAL_KEYS[1], JSON.stringify(stats));
  localStorage.setItem(LOCAL_KEYS[2], JSON.stringify(achievements));
  localStorage.setItem(LOCAL_KEYS[3], theme);
};

export const isVkStorageAvailable = () => bridge.isEmbedded();

export const loadCloudProgress = async () => {
  const response = await bridge.send('VKWebAppStorageGet', { keys: [CLOUD_KEY] });
  const raw = response.keys?.find((entry) => entry.key === CLOUD_KEY)?.value;
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (parsed?.version !== 1 || !parsed.progress) return null;
  return parsed.progress;
};

export const saveCloudProgress = async (progress) => {
  const value = JSON.stringify({ version: 1, progress });
  // VK Storage limits each value to 4096 characters.
  if (value.length > 4096) throw new Error('VK Storage: progress is too large');
  await bridge.send('VKWebAppStorageSet', { key: CLOUD_KEY, value });
};
