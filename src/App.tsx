import { useState, useEffect } from 'react';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const COLOR_MAP = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#fbbf24',
};

function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'won'>('menu');
  const [score, setScore] = useState(5);
  const [currentColor, setCurrentColor] = useState('red');
  const [targetColor, setTargetColor] = useState('red');
  const [colorIndex, setColorIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pressedTooEarly, setPressedTooEarly] = useState(false);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const colors = COLORS.filter(c => c !== targetColor);
    let index = 0;

    const colorCycle = setInterval(() => {
      if (index < colors.length) {
        setCurrentColor(colors[index]);
        setColorIndex(index);
        index++;
      } else {
        setIsActive(true);
        setCurrentColor(targetColor);
        clearInterval(colorCycle);
      }
    }, 500);

    return () => clearInterval(colorCycle);
  }, [gameState, targetColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          if (isActive && currentColor === targetColor) {
            handleCorrectPress();
          } else if (!isActive) {
            handleTooEarly();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isActive, currentColor, targetColor, score]);

  const handleCorrectPress = () => {
    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= 10) {
      setGameState('won');
    } else {
      startNewRound();
    }
  };

  const handleTooEarly = () => {
    const newScore = score - 1;
    setScore(newScore);

    if (newScore <= 0) {
      setGameState('gameover');
    } else {
      setPressedTooEarly(true);
      setTimeout(() => setPressedTooEarly(false), 300);
      startNewRound();
    }
  };

  const startNewRound = () => {
    setIsActive(false);
    const newTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(newTarget);
    setColorIndex(-1);
  };

  const startGame = () => {
    setScore(5);
    setGameState('playing');
    const newTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(newTarget);
    setIsActive(false);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(5);
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 flex-col">
      <div className="fixed top-8 right-8 text-white">
        <div className="text-4xl font-bold">Score: {score}</div>
      </div>

      {gameState === 'menu' && (
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-white mb-6">Color Press</h1>
          <p className="text-slate-300 text-xl mb-8">Watch the colors cycle and press SPACE when the target color appears!</p>
          <div className="bg-slate-800 rounded-lg p-8 mb-8">
            <p className="text-slate-400 mb-4">Rules:</p>
            <ul className="text-slate-300 text-left space-y-2">
              <li>Start with 5 points</li>
              <li>Get 10 points to win</li>
              <li>Each correct press = +1 point</li>
              <li>Pressing too early = -1 point</li>
              <li>Reach 0 points = Game Over</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-2xl">
          <div
            className={`w-full h-96 rounded-xl shadow-2xl transition-all duration-200 ${
              pressedTooEarly ? 'ring-4 ring-red-500' : ''
            }`}
            style={{
              backgroundColor: COLOR_MAP[currentColor as keyof typeof COLOR_MAP],
              opacity: isActive ? 1 : 0.6,
            }}
          />
          <div className="text-center mt-8">
            <p className="text-slate-300 text-lg mb-4">Press SPACE when this color appears:</p>
            <div className="flex justify-center gap-4 mb-6">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`w-16 h-16 rounded-lg transition-all ${
                    targetColor === color ? 'ring-4 ring-white scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: COLOR_MAP[color as keyof typeof COLOR_MAP],
                    opacity: targetColor === color ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
            {pressedTooEarly && (
              <p className="text-red-400 text-lg font-semibold">Too early! -1 point</p>
            )}
            {isActive && (
              <p className="text-green-400 text-lg font-semibold">Press SPACE now!</p>
            )}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center">
          <div className="bg-slate-800 rounded-xl p-12 shadow-2xl">
            <h2 className="text-5xl font-bold text-red-400 mb-6">Game Over</h2>
            <p className="text-slate-300 text-xl mb-8">You reached 0 points. Better luck next time!</p>
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-xl transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className="text-center">
          <div className="bg-slate-800 rounded-xl p-12 shadow-2xl">
            <h2 className="text-5xl font-bold text-green-400 mb-6">You Won!</h2>
            <p className="text-slate-300 text-xl mb-8">Congratulations! You reached 10 points!</p>
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-xl transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
