import { useEffect, useState } from 'react';
import { Panel, PanelHeader } from '@vkontakte/vkui';
import { MainMenu } from '../components/MainMenu';
import { GameBoard } from '../components/GameBoard';
import { createCards, defaultStats, levels, readStored } from '../utils/memoryGame';
import { playSound } from '../utils/sounds';
import { earnedAchievements } from '../utils/achievements';

export const Home = ({ id }) => {
  // Navigation and player preferences
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Current game
  const [cards, setCards] = useState(() => createCards('medium'));
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  // Saved records and statistics (same storage keys as before)
  const [records, setRecords] = useState(() =>
    readStored('memoryGameRecords', () => ({}))
  );
  const [stats, setStats] = useState(() =>
    readStored('memoryGameStats', defaultStats)
  );

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = readStored('memoryGameAchievements', () => []);
    const previousStats = readStored('memoryGameStats', defaultStats);
    return earnedAchievements(Array.isArray(saved) ? saved : [], {
      wins: previousStats.wins || 0,
      level: null,
      moves: null,
    });
  });

  // Award milestones from existing statistics, even before the next game.
  useEffect(() => {
    localStorage.setItem('memoryGameAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const startGame = (selectedLevel = level) => {
    setLevel(selectedLevel);
    setCards(createCards(selectedLevel));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setElapsed(0);
    setTimerStarted(false);
    setPaused(false);
    setNewAchievements([]);
    setLocked(false);
    setStarted(true);

    const updatedStats = {
      ...stats,
      games: stats.games + 1,
      levels: {
        ...stats.levels,
        [selectedLevel]: stats.levels[selectedLevel] + 1,
      },
    };

    setStats(updatedStats);
    localStorage.setItem('memoryGameStats', JSON.stringify(updatedStats));
  };

  const handleCardClick = (card) => {
    if (paused || locked || selected.includes(card.id) || matched.includes(card.symbol)) {
      return;
    }

    setTimerStarted(true);
    if (soundEnabled) playSound('flip');

    const nextSelected = [...selected, card.id];
    setSelected(nextSelected);

    if (nextSelected.length !== 2) return;

    setMoves((previous) => previous + 1);
    setLocked(true);

    const firstCard = cards[nextSelected[0]];
    const secondCard = cards[nextSelected[1]];
    const isMatch = firstCard.symbol === secondCard.symbol;

    if (isMatch) {
      if (soundEnabled) playSound('match');
      setMatched((previous) => [...previous, firstCard.symbol]);
    } else if (soundEnabled) {
      playSound('error');
    }

    setTimeout(() => {
      setSelected([]);
      setLocked(false);
    }, isMatch ? 450 : 1000);
  };

  const isWon = matched.length === levels[level].pairs;

  // Save a victory and update the best time
  useEffect(() => {
    if (!isWon) return;

    if (soundEnabled) playSound('win');

    const previousRecord = records[level];
    if (previousRecord === undefined || elapsed < previousRecord) {
      const updatedRecords = { ...records, [level]: elapsed };
      setRecords(updatedRecords);
      localStorage.setItem('memoryGameRecords', JSON.stringify(updatedRecords));
    }

    const updatedStats = { ...stats, wins: stats.wins + 1 };
    setStats(updatedStats);
    localStorage.setItem('memoryGameStats', JSON.stringify(updatedStats));

    const nextAchievements = earnedAchievements(unlockedAchievements, {
      wins: updatedStats.wins,
      level,
      moves,
    });
    const newlyEarned = nextAchievements.filter((id) => !unlockedAchievements.includes(id));
    setNewAchievements(newlyEarned);
    if (soundEnabled && newlyEarned.length > 0) playSound('achievement');
    setUnlockedAchievements(nextAchievements);
    localStorage.setItem('memoryGameAchievements', JSON.stringify(nextAchievements));
  }, [isWon]);

  // Timer starts only after the first card flip
  useEffect(() => {
    if (!started || !timerStarted || isWon || paused) return;

    const timer = setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timerStarted, isWon, paused]);

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
          <MainMenu
            level={level}
            onSelectLevel={setLevel}
            onPlay={() => startGame()}
            records={records}
            stats={stats}
            unlockedAchievements={unlockedAchievements}
          />
        ) : (
          <GameBoard
            level={level}
            cards={cards}
            selected={selected}
            matched={matched}
            moves={moves}
            elapsed={elapsed}
            locked={locked}
            paused={paused}
            onPause={() => setPaused(true)}
            onResume={() => setPaused(false)}
            isWon={isWon}
            newAchievements={newAchievements}
            onCardClick={handleCardClick}
            onRestart={() => startGame()}
            onHome={() => {
              setPaused(false);
              setStarted(false);
            }}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((previous) => !previous)}
          />
        )}
      </div>
    </Panel>
  );
};
