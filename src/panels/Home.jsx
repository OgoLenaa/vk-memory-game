
import { useState, useEffect } from 'react';
import { Panel, PanelHeader, Button } from '@vkontakte/vkui';
const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const sounds = {
    flip: { frequency: 500, duration: 0.08 },
    match: { frequency: 750, duration: 0.15 },
    error: { frequency: 180, duration: 0.2 },
    win: { frequency: 950, duration: 0.4 },
  };

  const sound = sounds[type];
  if (!sound) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.frequency.value = sound.frequency;
  oscillator.type = 'sine';

  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + sound.duration
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + sound.duration);
};

const symbols = [
  '🍓', '🚀', '🌙', '🐱', '🎈', '🍀',
  '🍉', '⭐', '🦋', '🍒', '🐼', '🌸',
];

const levels = {
  easy: { name: 'Лёгкий', pairs: 4 },
  medium: { name: 'Средний', pairs: 8 },
  hard: { name: 'Сложный', pairs: 12 },
};

const createCards = (level) => {
  const selectedSymbols = symbols.slice(0, levels[level].pairs);
  const shuffled = [...selectedSymbols, ...selectedSymbols];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((symbol, index) => ({
    id: index,
    symbol,
  }));
};

export const Home = ({ id }) => {
  const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cards, setCards] = useState(() => createCards('medium'));
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [records, setRecords] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('memoryGameRecords')) || {};
  } catch {
    return {};
  }
});

  const [stats, setStats] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('memoryGameStats')) || {
      games: 0,
      wins: 0,
      levels: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
  } catch {
    return {
      games: 0,
      wins: 0,
      levels: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
  }
});

  const startGame = (selectedLevel = level) => {
    setLevel(selectedLevel);
    setCards(createCards(selectedLevel));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setElapsed(0);
    setTimerStarted(false);
    const updatedStats = {
  ...stats,
  games: stats.games + 1,
  levels: {
    ...stats.levels,
    [selectedLevel]: stats.levels[selectedLevel] + 1,
  },
};

setStats(updatedStats);

localStorage.setItem(
  'memoryGameStats',
  JSON.stringify(updatedStats)
);
    setLocked(false);
    setStarted(true);
  };

  const handleCardClick = (card) => {
    if (
      locked ||
      selected.includes(card.id) ||
      matched.includes(card.symbol)
    ) {
      return;
    }
    setTimerStarted(true);

    if (soundEnabled) playSound('flip');
    const nextSelected = [...selected, card.id];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setLocked(true);

      const firstCard = cards[nextSelected[0]];
      const secondCard = cards[nextSelected[1]];

      if (firstCard.symbol === secondCard.symbol) {
        if (soundEnabled) playSound('match');
        setMatched((prev) => [...prev, firstCard.symbol]);

        setTimeout(() => {
          setSelected([]);
          setLocked(false);
        }, 450);
      } else {
        if (soundEnabled) playSound('error');
        setTimeout(() => {
          setSelected([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  const isWon = matched.length === levels[level].pairs;
useEffect(() => {
  if (!isWon) return;

  if (soundEnabled) playSound('win');

  const previousRecord = records[level];

  if (previousRecord === undefined || elapsed < previousRecord) {
    const updatedRecords = {
      ...records,
      [level]: elapsed,
    };

    setRecords(updatedRecords);

    localStorage.setItem(
      'memoryGameRecords',
      JSON.stringify(updatedRecords)
    );
  }

  const updatedStats = {
    ...stats,
    wins: stats.wins + 1,
  };

  setStats(updatedStats);

  localStorage.setItem(
    'memoryGameStats',
    JSON.stringify(updatedStats)
  );
}, [isWon]);
useEffect(() => {
  if (!started || !timerStarted || isWon) return;

  const timer = setInterval(() => {
    setElapsed((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [started, timerStarted, isWon]);



const cardStyle = (isOpen, isMatched) => ({
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: 18,
  border: isMatched
    ? '2px solid #8fcaad'
    : isOpen
      ? '2px solid #c4b5fd'
      : '1px solid #65538f',
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



  return (
    <Panel id={id}>
      <PanelHeader>Найди пару</PanelHeader>

      <div
        style={{
          minHeight: '85vh',
          padding: '24px 16px',
          background: 'linear-gradient(160deg, #171329, #0e0b19)',
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {!started ? (
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
                  onClick={() => setLevel(key)}
                  style={{
                    padding: 16,
                    borderRadius: 15,
                    border: level === key
                      ? '2px solid #a78bfa'
                      : '1px solid #514477',
                    background: level === key ? '#493477' : '#241e39',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {item.name}
                    {level === key ? '  ✓' : ''}
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
  onClick={() => startGame()}
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

            <div style={{
  marginTop: 25,
  padding: 18,
  borderRadius: 16,
  background: '#241e39',
}}>
  <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>
    🏆 Мои рекорды
  </h3>

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
        {records[key] !== undefined
          ? formatTime(records[key])
          : '—'}
      </span>
    </div>
  ))}
</div>

            <div style={{
  marginTop: 18,
  padding: 18,
  borderRadius: 16,
  background: '#241e39',
}}>
  <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>
    Моя статистика
  </h3>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  }}>
    <div>
      <div style={{ color: '#b9b1d0', fontSize: 12 }}>
        ВСЕГО ИГР
      </div>
      <div style={{ fontSize: 25, fontWeight: 800 }}>
        {stats.games}
      </div>
    </div>

    <div>
      <div style={{ color: '#b9b1d0', fontSize: 12 }}>
        ПОБЕД
      </div>
      <div style={{ fontSize: 25, fontWeight: 800 }}>
        {stats.wins}
      </div>
    </div>

    <div>
      <div style={{ color: '#b9b1d0', fontSize: 12 }}>
        ПРОЦЕНТ ПОБЕД
      </div>
      <div style={{ fontSize: 25, fontWeight: 800 }}>
        {stats.games > 0
          ? Math.round((stats.wins / stats.games) * 100)
          : 0}%
      </div>
    </div>
  </div>

  <div style={{
    marginTop: 18,
    borderTop: '1px solid #514477',
    paddingTop: 12,
  }}>
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
          </div>
        ) : (
          <div style={{ maxWidth: 450, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <h2>Найди все пары!</h2>
              <div style={{ color: '#b9b1d0', fontSize: 14 }}>
                Уровень: {levels[level].name}
              </div>
            </div>

            <div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 15,
}}>
  <Button
    size="s"
    mode="secondary"
    onClick={() => setMenuOpen(true)}
  >
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
  <div style={{
    padding: '13px 5px',
    borderRadius: 15,
    background: '#241e39',
    textAlign: 'center',
  }}>
    <div style={{ color: '#b9b1d0', fontSize: 11 }}>ХОДЫ</div>
    <div style={{ fontSize: 23, fontWeight: 800 }}>{moves}</div>
  </div>

  <div style={{
    padding: '13px 5px',
    borderRadius: 15,
    background: '#241e39',
    textAlign: 'center',
  }}>
    <div style={{ color: '#b9b1d0', fontSize: 11 }}>ВРЕМЯ</div>
    <div style={{ fontSize: 23, fontWeight: 800 }}>
      {formatTime(elapsed)}
    </div>
  </div>

  <div style={{
    padding: '13px 5px',
    borderRadius: 15,
    background: '#241e39',
    textAlign: 'center',
  }}>
    <div style={{ color: '#b9b1d0', fontSize: 11 }}>НАЙДЕНО</div>
    <div style={{ fontSize: 23, fontWeight: 800 }}>
      {matched.length}/{levels[level].pairs}
    </div>
  </div>
</div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 9,
              }}
            >
              {cards.map((card) => {
                const isOpen =
                  selected.includes(card.id) ||
                  matched.includes(card.symbol);

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isOpen || locked}
                    style={cardStyle(isOpen, matched.includes(card.symbol))}
                  >
                    {isOpen ? card.symbol : '✦'}
                  </button>
                );
              })}
            </div>


{isWon && (
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
    <div style={{ fontSize: 55, marginBottom: 10 }}>
      🏆
    </div>

    <h2 style={{ color: '#d8c7ff', margin: '5px 0 10px' }}>
      Ты победила!
    </h2>

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
      <div style={{
        background: '#241b38',
        padding: 15,
        borderRadius: 15,
      }}>
        <div style={{ color: '#b9b1d0', fontSize: 12 }}>
          ХОДЫ
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, color: '#ffffff' }}>
          {moves}
        </div>
      </div>

      <div style={{
        background: '#241b38',
        padding: 15,
        borderRadius: 15,
      }}>
        <div style={{ color: '#b9b1d0', fontSize: 12 }}>
          ВРЕМЯ
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, color: '#ffffff' }}>
          {formatTime(elapsed)}
        </div>
      </div>
    </div>


<div style={{
  display: 'flex',
  gap: 10,
  marginTop: 5,
}}>
  <Button
    size="l"
    mode="secondary"
    onClick={() => setStarted(false)}
    style={{
      flex: 1,
      minWidth: 0,
      borderRadius: 15,
    }}
  >
    В меню
  </Button>

  <Button
    size="l"
    onClick={() => startGame()}
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
)}

{menuOpen && (
  <div
    onClick={() => setMenuOpen(false)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 1000,
    }}
  >
    <div
      onClick={(event) => event.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: 340,
        padding: 24,
        borderRadius: 22,
        background: 'linear-gradient(145deg, #3d2d60, #241b38)',
        border: '1px solid #65538f',
        boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
      }}>
        <h2 style={{ color: '#d8c7ff', margin: 0 }}>
          Меню игры
        </h2>

        <button
          onClick={() => setMenuOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: 25,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      <Button
        stretched
        size="l"
        mode="secondary"
        onClick={() => {
          setMenuOpen(false);
          setStarted(false);
        }}
        style={{ marginBottom: 14 }}
      >
        В главное меню
      </Button>

      <Button
        stretched
        size="l"
        mode="secondary"
        onClick={() => setSoundEnabled((prev) => !prev)}
      >
        {soundEnabled ? '🔊 Звук включён' : '🔇 Звук выключен'}
      </Button>
    </div>
  </div>
)}


          </div>
        )}
      </div>
    </Panel>
  );
};
