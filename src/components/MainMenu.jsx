import { useState } from 'react';
import { Button } from '@vkontakte/vkui';
import { levels, formatTime } from '../utils/memoryGame';
import { achievements, achievementProgress } from '../utils/achievements';
import { themes, isThemeUnlocked } from '../utils/themes';

const panelStyle = {
  position: 'fixed', inset: 0, zIndex: 1050,
  background: 'rgba(7, 5, 18, 0.82)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 16, boxSizing: 'border-box',
};
const contentStyle = {
  width: '100%', maxWidth: 420, maxHeight: 'calc(100dvh - 32px)',
  overflowY: 'auto', boxSizing: 'border-box', padding: 24,
  borderRadius: 22, border: '1px solid #8065b5',
  background: 'linear-gradient(145deg, #3d2d60, #241b38)',
  boxShadow: '0 12px 35px rgba(0,0,0,0.4)', color: '#fff',
};
const tileStyle = {
  border: '1px solid #65538f', borderRadius: 16,
  background: '#382b53', color: '#fff', cursor: 'pointer',
  padding: '18px 8px', display: 'grid', gap: 9,
  justifyItems: 'center', fontSize: 14, fontWeight: 700,
};

export const MainMenu = ({ level, onSelectLevel, onPlay, records, stats, unlockedAchievements, theme, onSelectTheme }) => {
  const [section, setSection] = useState(null);
  const palette = themes[theme] || themes.amethyst;
  const close = () => setSection(null);
  const sections = [
    ['records', '🏆', 'Рекорды'],
    ['stats', '📊', 'Статистика'],
    ['achievements', '🎖️', 'Награды'],
    ['themes', '🎨', 'Темы'],
  ];

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', minHeight: 'min(650px, 75dvh)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
      <div style={{ fontSize: 68 }}>🧠</div>
      <div>
        <h1 style={{ color: palette.text, margin: '0 0 10px' }}>Найди пару</h1>
        <p style={{ color: '#b9b1d0', margin: 0 }}>Тренируй память и собирай достижения!</p>
      </div>
      <button type="button" onClick={() => setSection('play')}
        style={{ width: '100%', height: 56, minHeight: 56, flex: '0 0 56px', border: 'none', borderRadius: 16,
          background: palette.accent, color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>
        ▶ Играть
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {sections.map(([key, icon, title]) => (
          <button key={key} type="button" onClick={() => setSection(key)} style={{ ...tileStyle, background: palette.surface, borderColor: palette.accent }}>
            <span style={{ fontSize: 27 }}>{icon}</span><span>{title}</span>
          </button>
        ))}
      </div>
      {section && (
        <div style={panelStyle}>
          <div role="dialog" aria-modal="true" aria-labelledby="menu-section-title" style={{ ...contentStyle, background: palette.surface, borderColor: palette.accent }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 36, marginBottom: 20, paddingRight: 36, paddingLeft: 36 }}>
              <h2 id="menu-section-title" style={{ color: palette.text, margin: 0, textAlign: 'center' }}>
              {section === 'play' ? 'Выбери сложность' : section === 'records' ? '🏆 Мои рекорды' : section === 'stats' ? '📊 Моя статистика' : section === 'themes' ? '🎨 Темы оформления' : '🎖️ Мои достижения'}
              </h2>
              <button type="button" onClick={close} aria-label="Закрыть окно"
                style={{ position: 'absolute', right: 0, top: 0, width: 36, height: 36, border: 'none',
                  borderRadius: 10, background: 'rgba(255,255,255,0.10)', color: '#fff',
                  fontSize: 26, lineHeight: '36px', cursor: 'pointer' }}>×</button>
            </div>
            {section === 'play' && (
              <>
                <div style={{ display: 'grid', gap: 12 }}>
                  {Object.entries(levels).map(([key, item]) => (
                    <button key={key} type="button" onClick={() => onSelectLevel(key)}
                      style={{ padding: 16, borderRadius: 15, textAlign: 'left', cursor: 'pointer', color: '#fff',
                        border: level === key ? `2px solid ${palette.accent}` : `1px solid ${palette.accent}77`,
                        background: level === key ? palette.accent : palette.surface }}>
                      <div style={{ fontWeight: 700 }}>{item.name}{level === key ? ' ✓' : ''}</div>
                      <div style={{ color: '#b9b1d0', fontSize: 13, marginTop: 5 }}>{item.pairs} пар · {item.pairs * 2} карточек</div>
                    </button>
                  ))}
                </div>
                <Button stretched size="l" onClick={onPlay} style={{ marginTop: 18, background: palette.accent, borderRadius: 14 }}>
                  Начать игру
                </Button>
              </>
            )}
            {section === 'records' && Object.entries(levels).map(([key, item]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${palette.accent}77` }}>
                <span>{item.name}</span>
                <strong style={{ color: palette.text }}>{records[key] !== undefined ? formatTime(records[key]) : '—'}</strong>
              </div>
            ))}
            {section === 'stats' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, textAlign: 'center' }}>
                  {[
                    ['ВСЕГО ИГР', stats.games],
                    ['ПОБЕД', stats.wins],
                    ['ПРОЦЕНТ ПОБЕД', `${stats.games > 0 ? Math.round(stats.wins / stats.games * 100) : 0}%`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: palette.surface, borderRadius: 12, padding: 12 }}>
                      <div style={{ color: '#b9b1d0', fontSize: 11 }}>{label}</div>
                      <div style={{ fontSize: 25, fontWeight: 800 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <h3 style={{ marginBottom: 8 }}>Игры и победы по уровням</h3>
                {Object.entries(levels).map(([key, item]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>{item.name}</span><strong>{stats.levels[key] || 0} игр · {stats.winsByLevel?.[key] || 0} побед</strong>
                  </div>
                ))}
              </>
            )}
            {section === 'themes' && (
              <div style={{ display: 'grid', gap: 12 }}>
                {Object.entries(themes).map(([key, item]) => (
                  <button key={key} type="button" disabled={!isThemeUnlocked(key, stats.wins)} onClick={() => onSelectTheme(key)}
                    aria-pressed={theme === key}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                      textAlign: 'left', color: '#fff', cursor: isThemeUnlocked(key, stats.wins) ? 'pointer' : 'not-allowed',
                      opacity: isThemeUnlocked(key, stats.wins) ? 1 : 0.7, borderRadius: 15,
                      border: theme === key ? `2px solid ${item.accent}` : '1px solid #65538f',
                      background: item.surface }}>
                    <span style={{ fontSize: 30 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}><strong>{item.name}</strong>
                      <span style={{ display: 'block', fontSize: 12, marginTop: 5, color: item.text }}>{item.description}</span>
                      {!isThemeUnlocked(key, stats.wins) && <span style={{ display: 'block', fontSize: 12, marginTop: 6, color: '#fff' }}>
                        🔒 Откроется после {item.requiredWins} побед · {Math.min(stats.wins, item.requiredWins)} / {item.requiredWins}
                      </span>}
                    </span>
                    {theme === key && <span aria-label="Выбрана">✓</span>}
                  </button>
                ))}
              </div>
            )}
            {section === 'achievements' && (
              <>
                <p style={{ color: '#c8bddf', textAlign: 'center' }}>
                  Открыто {achievements.filter(item => unlockedAchievements.includes(item.id)).length} из {achievements.length}
                </p>
                <div style={{ display: 'grid', gap: 10 }}>
                  {achievements.map((item) => {
                    const unlocked = unlockedAchievements.includes(item.id);
                    const progress = achievementProgress(item.id, stats);
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                        borderRadius: 12, background: unlocked ? palette.accent : palette.surface, opacity: unlocked ? 1 : 0.65 }}>
                        <span style={{ fontSize: 27 }}>{unlocked ? item.icon : '🔒'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}><strong>{item.title}</strong><div style={{ color: '#b9b1d0', fontSize: 12, marginTop: 4 }}>{item.description}</div>
                          {progress && <div style={{ marginTop: 8 }}>
                            <div style={{ color: palette.text, fontSize: 12, marginBottom: 4 }}>{progress.current} / {progress.target}</div>
                            <div role="progressbar" aria-valuemin={0} aria-valuemax={progress.target} aria-valuenow={progress.current}
                              aria-label={`Прогресс: ${item.title}`}
                              style={{ height: 7, borderRadius: 8, background: '#ffffff30', overflow: 'hidden' }}>
                              <div style={{ width: `${100 * progress.current / progress.target}%`, height: '100%', borderRadius: 8, background: palette.text }} />
                            </div>
                          </div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
