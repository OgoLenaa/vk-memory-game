import { Button } from '@vkontakte/vkui';
import { formatTime } from '../utils/memoryGame';

export const WinScreen = ({ moves, elapsed, onHome, onRestart }) => (
  <div
    style={{
      marginTop: 25,
      padding: 25,
      background: 'linear-gradient(145deg, #3d2d60, #29203f)',
      border: '1px solid #8065b5',
      borderRadius: 22,
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
    }}
  >
    <div style={{ fontSize: 55, marginBottom: 10 }}>🏆</div>
    <h2 style={{ color: '#d8c7ff', margin: '5px 0 10px' }}>Ты победила!</h2>
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
        <div key={label} style={{ background: '#241b38', padding: 15, borderRadius: 15 }}>
          <div style={{ color: '#b9b1d0', fontSize: 12 }}>{label}</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: '#ffffff' }}>{value}</div>
        </div>
      ))}
    </div>

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
          background: '#8055d9',
          fontWeight: 700,
        }}
      >
        Играть ещё раз
      </Button>
    </div>
  </div>
);
