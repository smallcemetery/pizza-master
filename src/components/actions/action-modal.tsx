'use client';

import { X } from '@phosphor-icons/react';
import { useEffect } from 'react';

export type ActionItem = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type Props = {
  action: ActionItem;
  onClose: () => void;
};

export const ActionModal = ({ action, onClose }: Props) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4'
      onClick={onClose}>
      <div
        className='bg-[#FFF3E6] w-full sm:max-w-md sm:rounded-[20px] border-t sm:border border-black max-h-[92vh] overflow-y-auto shadow-grow'
        onClick={(e) => e.stopPropagation()}>
        <div className='relative h-[180px] sm:h-[220px] bg-[#FDB4B4]/20 border-b border-black'>
          {action.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={action.image} alt={action.name} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-4xl'>🎁</div>
          )}
          <button
            type='button'
            onClick={onClose}
            className='absolute top-2 right-2 size-8 bg-white/90 border border-black rounded-full flex items-center justify-center cursor-pointer hover:bg-white'
            aria-label='Закрыть'>
            <X size={16} weight='bold' />
          </button>
        </div>
        <div className='p-4 sm:p-5'>
          <h2 className='text-base sm:text-lg font-medium mb-3 pr-6'>{action.name}</h2>
          <p className='text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
            {action.description}
          </p>
          <button
            type='button'
            onClick={onClose}
            className='mt-5 w-full border border-black py-2.5 text-sm bg-white hover:bg-[#FDB4B4]/20 cursor-pointer rounded-lg'>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
