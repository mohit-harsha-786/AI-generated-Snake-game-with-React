import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
        case 'Escape':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 neon-border-cyan w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold text-white neon-text-cyan font-sans uppercase tracking-widest">Snake</h2>
        <div className="text-xl font-mono text-fuchsia-400 neon-text-fuchsia">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-black/50 border-2 border-gray-800 rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                ${isSnakeHead ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10 rounded-sm' : ''}
                ${isSnakeBody ? 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.5)] rounded-sm' : ''}
                ${isFood ? 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.9)] rounded-full animate-pulse z-10' : ''}
              `}
            />
          );
        })}

        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h3 className={`text-4xl font-bold mb-4 ${gameOver ? 'text-red-500 neon-text-fuchsia' : 'text-cyan-400 neon-text-cyan'}`}>
              {gameOver ? 'GAME OVER' : 'PAUSED'}
            </h3>
            {gameOver && (
              <p className="text-gray-300 font-mono mb-6 text-lg">Final Score: {score}</p>
            )}
            <button
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400 hover:text-black transition-all neon-border-cyan uppercase tracking-wider"
            >
              {gameOver ? 'Play Again' : 'Resume'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-500 font-mono text-sm text-center">
        Use <span className="text-cyan-400">W A S D</span> or <span className="text-cyan-400">Arrow Keys</span> to move.<br/>
        Press <span className="text-cyan-400">Space</span> to pause.
      </div>
    </div>
  );
}
