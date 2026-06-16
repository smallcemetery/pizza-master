'use client';
import op from '@/assets/op.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageCard, PageCardAccent, PageShell } from '@/shared/ui/page-shell';
import { useState } from 'react';

export const CorporateModule = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageShell>
      <PageCard>
        <h1 className='text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4'>Корпоративные заказы</h1>
        <p className='text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4'>
          Организуем питание для офиса, мероприятий и праздников. Скидки от 10 заказов, индивидуальное меню и
          доставка в удобное время.
        </p>
        <ul className='text-xs sm:text-sm flex flex-col gap-1.5 sm:gap-2 list-disc pl-4 sm:pl-5 mb-4 sm:mb-5'>
          <li>Наборы пицц и закусок для команды</li>
          <li>Оплата по счёту для юрлиц</li>
          <li>Персональный менеджер</li>
          <li>Брендирование упаковки по запросу</li>
        </ul>

        <div className='w-full h-[160px] sm:h-[200px] rounded-[10px] overflow-hidden border border-black'>
          <img src={op.src} alt='Корпоративный кейтеринг' className='w-full h-full object-cover' loading='eager' />
        </div>
      </PageCard>

      <form onSubmit={handleSubmit} className='contents'>
        <PageCardAccent className='flex flex-col gap-3 sm:gap-4'>
          <h2 className='font-medium text-sm sm:text-base'>Оставить заявку</h2>
          <Input placeholder='Название компании' required className='text-sm w-full' />
          <Input placeholder='Контактное лицо' required className='text-sm w-full' />
          <Input type='email' placeholder='Email' required className='text-sm w-full' />
          <Input type='tel' placeholder='Телефон' required className='text-sm w-full' />
          <Textarea
            placeholder='Количество человек, дата, пожелания...'
            className='min-h-[90px] sm:min-h-[100px] text-sm w-full'
            required
          />
          <Button
            type='submit'
            className='w-full sm:w-auto sm:min-w-[200px] border border-black cursor-pointer hover:bg-[#FDB4B4]/30 text-sm'>
            Отправить заявку
          </Button>
          {sent && (
            <p className='text-xs text-green-700'>Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
          )}
        </PageCardAccent>
      </form>
    </PageShell>
  );
};
