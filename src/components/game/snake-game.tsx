'use client';
import { Button } from '@/components/ui/button';
import { showSnakeGameAtom } from '@/store/game';
import { userAtom } from '@/store/user';
import { useSetAtom, useAtomValue } from 'jotai/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const GRID = 16;
const CELL = 18;
const MAX_BONUS = 50;
const TICK_MS = 140;

type Point = { x: number; y: number };

const randomFood = (snake: Point[]): Point => {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
};

export const SnakeGameOverlay = () => {
  const show = useAtomValue(showSnakeGameAtom);
  const setShow = useSetAtom(showSnakeGameAtom);
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);

  const [snake, setSnake] = useState<Point[]>([{ x: 4, y: 8 }, { x: 3, y: 8 }]);
  const [food, setFood] = useState<Point>({ x: 10, y: 8 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirRef = useRef(dir);
  const foodRef = useRef(food);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  const reset = useCallback(() => {
    const start = [{ x: 4, y: 8 }, { x: 3, y: 8 }];
    setSnake(start);
    setFood(randomFood(start));
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setSaved(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    reset();
  }, [show, reset]);

  useEffect(() => {
    if (!show || gameOver) return;

    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === 'ArrowUp' && d.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && d.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && d.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && d.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, gameOver]);

  useEffect(() => {
    if (!show || gameOver) return;

    const id = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const next = [head, ...prev];
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          setScore((s) => Math.min(s + 1, MAX_BONUS));
          const newFood = randomFood(next);
          foodRef.current = newFood;
          setFood(newFood);
          return next;
        }
        next.pop();
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [show, gameOver]);

  const saveBonuses = async () => {
    if (!user?.id || saved) return;
    const earned = Math.min(score, MAX_BONUS);
    if (earned <= 0) return;
    try {
      const { data } = await axios.patch('/api/user/bonuses', { userId: user.id, earned });
      setUser({ ...user, bonuses: data.user.bonuses });
      setSaved(true);
    } catch {
      console.error('Не удалось сохранить бонусы');
    }
  };

  const close = async () => {
    if (!saved && score > 0) await saveBonuses();
    setShow(false);
  };

  if (!show) return null;

  const earned = Math.min(score, MAX_BONUS);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-[#FFF3E6] border-2 border-black rounded-[20px] p-[25px] max-w-[400px] w-full shadow-grow'>
        <h2 className='text-lg text-center mb-[5px]'>🍕 Змейка-бонусы</h2>
        <p className='text-xs text-center mb-[15px] text-gray-600'>
          Собирайте пиццу стрелками! Максимум {MAX_BONUS} бонусов
        </p>

        <svg
          width={GRID * CELL}
          height={GRID * CELL}
          className='mx-auto block border-2 border-black rounded-[8px] bg-[#e8d8c9]'>
          {snake.map((s, i) => (
            <rect
              key={`s-${i}-${s.x}-${s.y}`}
              x={s.x * CELL + 1}
              y={s.y * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={4}
              fill={i === 0 ? '#FDB4B4' : '#BFACC0'}
              stroke='#000'
              strokeWidth={0.8}
            />
          ))}
          <text x={food.x * CELL + 3} y={food.y * CELL + 14} fontSize={14}>
            🍕
          </text>
        </svg>

        <p className='text-center mt-[12px] text-sm'>
          Бонусы: <strong>{earned}</strong> / {MAX_BONUS}
        </p>

        {gameOver && <p className='text-center text-xs text-red-600 mt-[5px]'>Игра окончена!</p>}

        <div className='flex gap-[10px] justify-center mt-[15px] flex-wrap'>
          {gameOver && (
            <Button
              type='button'
              onClick={reset}
              className='border border-black bg-white text-black cursor-pointer hover:bg-[#FDB4B4]/30'>
              Заново
            </Button>
          )}
          <Button
            type='button'
            onClick={close}
            className='border border-black cursor-pointer hover:bg-amber-50'>
            {saved ? 'Закрыть' : `Забрать ${earned} бонусов`}
          </Button>
        </div>
      </div>
    </div>
  );
};
