const sounds = {
  flip: { frequency: 500, duration: 0.08 },
  match: { frequency: 750, duration: 0.15 },
  error: { frequency: 180, duration: 0.2 },
  win: { frequency: 950, duration: 0.4 },
};

export const playSound = (type) => {
  if (type === 'achievement') {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/achievement.wav`);
    audio.volume = 0.65;
    audio.play().catch(() => {});
    return;
  }

  const sound = sounds[type];
  if (!sound) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
