import { Button } from '@vkontakte/vkui';
import { levels, formatTime } from '../utils/memoryGame';
import { achievements } from '../utils/achievements';

export const MainMenu = ({ level, onSelectLevel, onPlay, records, stats, unlockedAchievements }) => (
  <div style={{ textAlign: 'center', paddingTop: 35, maxWidth: 420, margin: '0 auto' }}>
    <div style={{ fontSize: 70, marginBottom: 15 }}>🧠</div>
    <h1 style={{ color: '#c4b5fd' }}>Найди пару</h1>
    <p style={{ color: '#b9b1d0', lineHeight: 1.6 }}>
      Проверь свою память и найди все одинаковые карточки!
    </p>

    <h3 style={{ marginTop: 35 }}>Выбери сложность</h3>
    <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
      {Object.entries(levels).map(([key, item]) => (
        <button
          key={key}
          onClick={() => onSelectLevel(key)}
          style={{
            padding: 16,
            borderRadius: 15,
            border: level === key ? '2px solid #a78bfa' : '1px solid #514477',
            background: level === key ? '#493477' : '#241e39',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {item.name}{level === key ? '  ✓' : ''}
          </div>
          <div style={{ color: '#b9b1d0', fontSize: 13, marginTop: 5 }}>
            {item.pairs} пар · {item.pairs * 2} карточек
          </div>
        </button>
      ))}
    </div>

    <Button
      stretched
      size="l"
      onClick={onPlay}
      style={{
        marginTop: 22,
        height: 52,
        borderRadius: 15,
        background: '#8055d9',
        fontWeight: 700,
      }}
    >
      Играть
    </Button>

    <div style={{ marginTop: 25, padding: 18, borderRadius: 16, background: '#241e39' }}>
      <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>🏆 Мои рекорды</h3>
      {Object.entries(levels).map(([key, item]) => (
        <div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #514477',
          }}
        >
          <span>{item.name}</span>
          <span style={{ color: '#c4b5fd', fontWeight: 700 }}>
            {records[key] !== undefined ? formatTime(records[key]) : '—'}
          </span>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: '#241e39' }}>
      <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>Моя статистика</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {[
          ['ВСЕГО ИГР', stats.games],
          ['ПОБЕД', stats.wins],
          ['ПРОЦЕНТ ПОБЕД', `${stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%`],
        ].map(([label, value]) => (
          <div key={label}>
            <div style={{ color: '#b9b1d0', fontSize: 12 }}>{label}</div>
            <div style={{ fontSize: 25, fontWeight: 800 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, borderTop: '1px solid #514477', paddingTop: 12 }}>
        <div style={{ color: '#b9b1d0', fontSize: 12, marginBottom: 10 }}>
          ИГРЫ ПО УРОВНЯМ
        </div>
        {Object.entries(levels).map(([key, item]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '7px 0',
            }}
          >
            <span>{item.name}</span>
            <strong>{stats.levels[key] || 0}</strong>
          </div>
        ))}
      </div>
    </div>

    <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: '#241e39' }}>
      <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>🎖️ Мои достижения</h3>
      <p style={{ color: '#b9b1d0', fontSize: 13 }}>
        Открыто {unlockedAchievements.length} из {achievements.length}
      </p>
      <div style={{ display: 'grid', gap: 10, textAlign: 'left' }}>
        {achievements.map((item) => {
          const unlocked = unlockedAchievements.includes(item.id);
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: 12,
                borderRadius: 12,
                background: unlocked ? '#403264' : '#1b172c',
                border: unlocked ? '1px solid #8065b5' : '1px solid #3b3450',
                opacity: unlocked ? 1 : 0.65,
              }}
            >
              <span style={{ fontSize: 27 }}>{unlocked ? item.icon : '🔒'}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: '#b9b1d0', fontSize: 12, marginTop: 4 }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
