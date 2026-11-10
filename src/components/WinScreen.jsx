import { Button } from '@vkontakte/vkui';
import { formatTime } from '../utils/memoryGame';
import { achievements } from '../utils/achievements';

export const WinScreen = ({ moves, elapsed, onHome, onRestart, newAchievements = [], palette }) => (
  <div
    role="presentation"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      background: 'rgba(7, 5, 18, 0.82)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      boxSizing: 'border-box',
    }}
  >
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="win-title"
    style={{
      width: '100%',
      maxWidth: 390,
      maxHeight: 'calc(100dvh - 32px)',
      overflowY: 'auto',
      boxSizing: 'border-box',
      padding: 25,
      background: palette?.surface || '#29203f',
      border: `1px solid ${palette?.accent || '#8065b5'}`,
      borderRadius: 22,
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
    }}
  >
    <div style={{ fontSize: 55, marginBottom: 10 }}>🏆</div>
    <h2 id="win-title" style={{ color: palette?.text || '#d8c7ff', margin: '5px 0 10px' }}>Победа!</h2>
    <p style={{ color: '#c8bddf', marginBottom: 22 }}>
      Все пары найдены! Отличная работа!
    </p>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 22,
      }}
    >
      {[
        ['ХОДЫ', moves],
        ['ВРЕМЯ', formatTime(elapsed)],
      ].map(([label, value]) => (
        <div key={label} style={{ background: palette?.background || '#241b38', padding: 15, borderRadius: 15 }}>
          <div style={{ color: '#b9b1d0', fontSize: 12 }}>{label}</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: '#ffffff' }}>{value}</div>
        </div>
      ))}
    </div>

    {newAchievements.length > 0 && (
      <div style={{ marginBottom: 22, padding: 16, borderRadius: 16, background: palette?.surface || '#463365', border: `1px solid ${palette?.accent || '#a78bfa'}` }} aria-live="polite">
        <div style={{ fontWeight: 800, color: '#e7d9ff', marginBottom: 12 }}>Новое достижение!</div>
        {achievements.filter((item) => newAchievements.includes(item.id)).map((item) => (
          <div key={item.id} style={{ marginTop: 10 }}>
            <div style={{ fontSize: 32 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>{item.title}</div>
            <div style={{ color: '#c8bddf', fontSize: 13 }}>{item.description}</div>
          </div>
        ))}
      </div>
    )}

    <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
      <Button
        size="l"
        mode="secondary"
        onClick={onHome}
        style={{ flex: 1, minWidth: 0, borderRadius: 15 }}
      >
        В меню
      </Button>
      <Button
        size="l"
        onClick={onRestart}
        style={{
          flex: 1,
          minWidth: 0,
          height: 52,
          borderRadius: 15,
          background: palette?.accent || '#8055d9',
          fontWeight: 700,
        }}
      >
        Играть ещё раз
      </Button>
    </div>
  </div>
  </div>
);
