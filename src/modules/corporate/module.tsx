'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export const CorporateModule = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-[50px] px-[100px]'>
      <div className='max-w-[900px] mx-auto flex flex-col gap-[30px]'>
        <div className='bg-white rounded-[15px] border border-black p-[30px] shadow-grow'>
          <h1 className='text-2xl mb-[15px]'>Корпоративные заказы</h1>
          <p className='text-sm leading-6 mb-[15px]'>
            Организуем питание для офиса, мероприятий и праздников. Скидки от 10 заказов, индивидуальное меню и
            доставка в удобное время.
          </p>
          <ul className='text-sm flex flex-col gap-[6px] list-disc pl-[20px] mb-[20px]'>
            <li>Наборы пицц и закусок для команды</li>
            <li>Оплата по счёту для юрлиц</li>
            <li>Персональный менеджер</li>
            <li>Брендирование упаковки по запросу</li>
          </ul>

          <div className='w-full h-[200px] rounded-[10px] bg-[#FDB4B4]/20 border border-dashed border-black flex items-center justify-center text-xs text-center px-4 mb-[25px]'>
            Место для фото корпоративного кейтеринга
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-[#FFF3E6] rounded-[15px] border border-black p-[25px] flex flex-col gap-[12px]'>
          <h2 className='font-medium'>Оставить заявку</h2>
          <Input placeholder='Название компании' required />
          <Input placeholder='Контактное лицо' required />
          <Input type='email' placeholder='Email' required />
          <Input type='tel' placeholder='Телефон' required />
          <Textarea placeholder='Количество человек, дата, пожелания...' className='min-h-[100px]' required />
          <Button type='submit' className='w-[200px] border border-black cursor-pointer hover:bg-[#FDB4B4]/30'>
            Отправить заявку
          </Button>
          {sent && <p className='text-xs text-green-700'>Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>}
        </form>
      </div>
    </div>
  );
};
