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
const SWIPE_THRESHOLD = 28;

type Point = { x: number; y: number };

const randomFood = (snake: Point[]): Point => {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
};

const DirButton = ({
  label,
  onPress,
  className = '',
}: {
  label: string;
  onPress: () => void;
  className?: string;
}) => (
  <button
    type='button'
    onPointerDown={(e) => {
      e.preventDefault();
      onPress();
    }}
    className={`size-11 sm:size-12 border-2 border-black bg-white text-lg active:bg-[#FDB4B4]/40 touch-manipulation select-none ${className}`}>
    {label}
  </button>
);

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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  const setDirection = useCallback((next: Point) => {
    const d = dirRef.current;
    if (next.x !== 0 && d.x === 0) setDir(next);
    if (next.y !== 0 && d.y === 0) setDir(next);
  }, []);

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
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    const prevPosition = document.body.style.position;
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
      document.body.style.position = prevPosition;
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const preventScrollKeys = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (overlayRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventScrollKeys, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', preventScrollKeys);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [show]);

  useEffect(() => {
    if (!show || gameOver) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown') setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft') setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight') setDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, gameOver, setDirection]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  };

  const saveBonuses = async () => {
    if (!user?.id || saved) return;
    const earned = Math.min(score, MAX_BONUS);
    if (earned <= 0) return;
    try {
      const { data } = await axios.patch('/api/user/bonuses', { userId: user.id, earned });
      setUser((prev: typeof user) => (prev ? { ...prev, bonuses: data.user.bonuses } : prev));
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
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overscroll-none touch-none'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      <div className='bg-[#FFF3E6] border-2 border-black rounded-[20px] p-[20px] sm:p-[25px] max-w-[400px] w-full shadow-grow max-h-[95vh] overflow-y-auto overscroll-contain'>
        <h2 className='text-lg text-center mb-[5px]'>🍕 Змейка-бонусы</h2>
        <p className='text-xs text-center mb-[12px] text-gray-600'>
          Свайпайте по полю или кнопками ниже. Максимум {MAX_BONUS} бонусов
        </p>

        <svg
          width={GRID * CELL}
          height={GRID * CELL}
          className='mx-auto block border-2 border-black rounded-[8px] bg-[#e8d8c9] touch-none'>
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

        <div className='mt-4 grid grid-cols-3 gap-1.5 w-fit mx-auto sm:hidden'>
          <div />
          <DirButton label='↑' onPress={() => setDirection({ x: 0, y: -1 })} />
          <div />
          <DirButton label='←' onPress={() => setDirection({ x: -1, y: 0 })} />
          <DirButton label='↓' onPress={() => setDirection({ x: 0, y: 1 })} />
          <DirButton label='→' onPress={() => setDirection({ x: 1, y: 0 })} />
        </div>

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
