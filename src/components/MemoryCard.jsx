import './MemoryCard.css';

// Both faces stay mounted so CSS can animate the rotation.
export const MemoryCard = ({ card, isOpen, isMatched, disabled, onClick, palette }) => (
  <button
    type="button"
    style={{ '--card-accent': palette?.accent || '#8055d9', '--card-surface': palette?.surface || '#241b38', '--card-text': palette?.text || '#d8c7ff' }}
    className={`memory-card${isOpen ? ' memory-card--open' : ''}${isMatched ? ' memory-card--matched' : ''}`}
    onClick={() => onClick(card)}
    disabled={disabled}
    aria-label={isMatched ? `Найдена пара: ${card.symbol}` : isOpen ? `Открыта: ${card.symbol}` : 'Закрытая карточка'}
    aria-pressed={isOpen}
  >
    <span className="memory-card__inner" aria-hidden="true">
      <span className="memory-card__face memory-card__back">✦</span>
      <span className="memory-card__face memory-card__front">{card.symbol}</span>
    </span>
  </button>
);
