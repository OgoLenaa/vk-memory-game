import { useState } from 'react';
import { Button } from '@vkontakte/vkui';
import { levels, formatTime } from '../utils/memoryGame';
import { WinScreen } from './WinScreen';
import { GameMenu } from './GameMenu';
import { MemoryCard } from './MemoryCard';

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
            <MemoryCard
              key={card.id}
              card={card}
              isOpen={isOpen}
              isMatched={isMatched}
              disabled={isOpen || locked}
              onClick={onCardClick}
            />
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
