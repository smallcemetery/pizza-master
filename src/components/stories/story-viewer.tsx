'use client';

import { X } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type StoryItem = {
  id: string;
  title: string;
  image: string | null;
};

const STORY_DURATION_MS = 5000;

type Props = {
  stories: StoryItem[];
  initialIndex?: number;
  onClose: () => void;
};

export const StoryViewer = ({ stories, initialIndex = 0, onClose }: Props) => {
  const withImages = stories.filter((s) => s.image);
  const items = withImages.length ? withImages : stories;

  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const current = items[index];

  const goNext = useCallback(() => {
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    } else {
      onClose();
    }
  }, [index, items.length, onClose]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  }, [index]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (paused || !current) return;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [index, paused, current, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goNext, goPrev]);

  if (!current) return null;

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else goNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPaused(false);
    startTimeRef.current = Date.now() - (progress / 100) * STORY_DURATION_MS;
    const start = touchStartX.current;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className='fixed inset-0 z-[100] bg-black flex items-center justify-center'>
      <div
        className='relative w-full h-full max-w-[430px] mx-auto sm:max-h-[92vh] sm:rounded-2xl sm:overflow-hidden sm:border sm:border-white/20'
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => {
          setPaused(false);
          startTimeRef.current = Date.now() - (progress / 100) * STORY_DURATION_MS;
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}>
        {/* Progress bars */}
        <div className='absolute top-0 left-0 right-0 z-20 flex gap-1 px-2 pt-2 sm:pt-3'>
          {items.map((_, i) => (
            <div key={i} className='flex-1 h-[2px] sm:h-[3px] bg-white/30 rounded-full overflow-hidden'>
              <div
                className='h-full bg-white rounded-full transition-[width] duration-75'
                style={{
                  width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className='absolute top-6 sm:top-8 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-4'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='size-8 sm:size-9 rounded-full border-2 border-[#FDB4B4] p-[2px] shrink-0'>
              <div className='w-full h-full rounded-full bg-[#FDB4B4] flex items-center justify-center text-sm'>
                🍕
              </div>
            </div>
            <span className='text-white text-xs sm:text-sm font-medium truncate drop-shadow'>
              {current.title}
            </span>
          </div>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className='text-white p-1.5 shrink-0 cursor-pointer hover:bg-white/10 rounded-full'
            aria-label='Закрыть'>
            <X size={22} weight='bold' />
          </button>
        </div>

        {/* Story image */}
        <div className='absolute inset-0 bg-[#1a1a1a]'>
          {current.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image}
              alt={current.title}
              className='w-full h-full object-cover'
              referrerPolicy='no-referrer'
            />
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center gap-4 text-white'>
              <span className='text-6xl'>🍕</span>
              <p className='text-lg px-4 text-center'>{current.title}</p>
            </div>
          )}
          <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none' />
        </div>

        <p className='absolute bottom-4 sm:bottom-6 left-3 right-3 z-20 text-white text-sm sm:text-base font-medium drop-shadow line-clamp-2'>
          {current.title}
        </p>
      </div>
    </div>
  );
};
