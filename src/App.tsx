import { useState } from 'react';
import { Timer } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'finished'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [boxPosition, setBoxPosition] = useState({ x: 50, y: 50 });

  const getRandomPosition = () => {
    const x = Math.random() * 70 + 10;
    const y = Math.random() * 70 + 10;
    return { x, y };
  };

  const startGame = () => {
    setGameState('ready');
    setBoxPosition(getRandomPosition());
    setStartTime(Date.now());
  };

  const handleBoxClick = () => {
    if (gameState === 'ready') {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setReactionTime(timeTaken);
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setReactionTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {gameState === 'waiting' && (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Reaction Time Game</h1>
            <p className="text-slate-300 mb-8 text-lg">Click the box as fast as you can!</p>
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="relative w-full h-[600px] bg-slate-700 rounded-xl shadow-2xl">
            <div
              onClick={handleBoxClick}
              style={{
                left: `${boxPosition.x}%`,
                top: `${boxPosition.y}%`,
              }}
              className="absolute w-20 h-20 bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 shadow-lg"
            />
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center">
            <div className="bg-slate-700 rounded-xl p-12 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <Timer className="w-16 h-16 text-green-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Your Time</h2>
              <div className="text-7xl font-bold text-green-400 mb-8">
                {reactionTime}ms
              </div>
              <div className="text-slate-300 mb-8 text-lg">
                {reactionTime < 300 && "Lightning fast!"}
                {reactionTime >= 300 && reactionTime < 500 && "Great reflexes!"}
                {reactionTime >= 500 && reactionTime < 700 && "Not bad!"}
                {reactionTime >= 700 && "Keep practicing!"}
              </div>
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
    </div>
  );
}

export default App;
