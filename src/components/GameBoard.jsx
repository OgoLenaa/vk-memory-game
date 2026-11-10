import { useState } from 'react';
import { Button } from '@vkontakte/vkui';
import { levels, formatTime } from '../utils/memoryGame';
import { WinScreen } from './WinScreen';
import { GameMenu } from './GameMenu';

const cardStyle = (isOpen, isMatched) => ({
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: 18,
  border: isMatched
    ? '2px solid #8fcaad'
    : isOpen ? '2px solid #c4b5fd' : '1px solid #65538f',
  background: isMatched
    ? 'linear-gradient(145deg, #365b50, #28463d)'
    : isOpen
      ? 'linear-gradient(145deg, #9470ed, #6343b5)'
      : 'linear-gradient(145deg, #403264, #241b3d)',
  color: '#ffffff',
  fontSize: 'clamp(24px, 7vw, 38px)',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: isOpen
    ? '0 4px 10px rgba(0,0,0,0.2)'
    : '0 5px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.08)',
  transition: 'all 0.2s ease',
  transform: isOpen ? 'scale(0.97)' : 'scale(1)',
  opacity: isMatched ? 0.85 : 1,
});

export const GameBoard = ({
  level, cards, selected, matched, moves, elapsed, locked, isWon,
  onCardClick, onRestart, onHome, soundEnabled, onToggleSound,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ maxWidth: 450, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <h2>Найди все пары!</h2>
        <div style={{ color: '#b9b1d0', fontSize: 14 }}>
          Уровень: {levels[level].name}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 15 }}>
        <Button size="s" mode="secondary" onClick={() => setMenuOpen(true)}>
          ☰ Меню
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          ['ХОДЫ', moves],
          ['ВРЕМЯ', formatTime(elapsed)],
          ['НАЙДЕНО', `${matched.length}/${levels[level].pairs}`],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: '13px 5px',
              borderRadius: 15,
              background: '#241e39',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#b9b1d0', fontSize: 11 }}>{label}</div>
            <div style={{ fontSize: 23, fontWeight: 800 }}>{value}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 9,
        }}
      >
        {cards.map((card) => {
          const isMatched = matched.includes(card.symbol);
          const isOpen = selected.includes(card.id) || isMatched;

          return (
            <button
              key={card.id}
              onClick={() => onCardClick(card)}
              disabled={isOpen || locked}
              style={cardStyle(isOpen, isMatched)}
            >
              {isOpen ? card.symbol : '✦'}
            </button>
          );
        })}
      </div>

      {isWon && (
        <WinScreen moves={moves} elapsed={elapsed} onHome={onHome} onRestart={onRestart} />
      )}

      {menuOpen && (
        <GameMenu
          onClose={() => setMenuOpen(false)}
          onHome={() => {
            setMenuOpen(false);
            onHome();
          }}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
      )}
    </div>
  );
};
