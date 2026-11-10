import { Button } from '@vkontakte/vkui';
import { levels, formatTime } from '../utils/memoryGame';
import { WinScreen } from './WinScreen';
import { GameMenu } from './GameMenu';
import { MemoryCard } from './MemoryCard';

export const GameBoard = ({
  level, cards, selected, matched, moves, elapsed, locked, paused, onPause, onResume, isWon, newAchievements,
  onCardClick, onRestart, onHome, soundEnabled, onToggleSound,
}) => {
  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', padding: '12px 0 24px', boxSizing: 'border-box' }}>
      <div style={{ padding: 'clamp(14px, 3vw, 26px)', borderRadius: 26, border: '1px solid #50406f', background: 'linear-gradient(145deg, #251d3d, #171226)', boxShadow: '0 16px 45px rgba(0,0,0,0.28)' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 6px', color: '#d8c7ff', fontSize: 'clamp(21px, 4vw, 28px)' }}>🧠 Найди все пары!</h2>
        <div style={{ color: '#b9b1d0', fontSize: 14 }}>
          Уровень: {levels[level].name}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button size="s" mode="secondary" onClick={onPause} style={{ flex: '0 0 auto', borderRadius: 12 }}>
          ☰ Меню
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 8,
          marginBottom: 16,
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
              padding: '10px 4px',
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
          gap: 'clamp(6px, 1.5vw, 10px)',
          width: '100%',
          maxWidth: 440,
          margin: '0 auto',
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
              disabled={isOpen || locked || paused}
              onClick={onCardClick}
            />
          );
        })}
      </div>

      </div>

      {isWon && (
        <WinScreen moves={moves} elapsed={elapsed} onHome={onHome} onRestart={onRestart} newAchievements={newAchievements} />
      )}

      {paused && (
        <GameMenu
          onClose={onResume}
          onHome={() => {
            onHome();
          }}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
      )}
    </div>
  );
};
