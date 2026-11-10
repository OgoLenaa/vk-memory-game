import { Button } from '@vkontakte/vkui';

export const GameMenu = ({ onClose, onHome, soundEnabled, onToggleSound }) => (
  <div
    onClick={onClose}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 22,
        }}
      >
        <h2 style={{ color: '#d8c7ff', margin: 0 }}>Пауза</h2>
        <button
          onClick={onClose}
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
        mode="primary"
        onClick={onClose}
        style={{ marginBottom: 14 }}
      >
        ▶ Продолжить игру
      </Button>

      <Button
        stretched
        size="l"
        mode="secondary"
        onClick={onHome}
        style={{ marginBottom: 14 }}
      >
        В главное меню
      </Button>

      <Button stretched size="l" mode="secondary" onClick={onToggleSound}>
        {soundEnabled ? '🔊 Звук включён' : '🔇 Звук выключен'}
      </Button>
    </div>
  </div>
);
