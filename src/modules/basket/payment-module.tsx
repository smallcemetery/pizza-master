'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSnakeGameAtom } from '@/store/game';
import { checkoutDraftAtom } from '@/store/checkout';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatCardNumber = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const PaymentModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setShowSnake = useSetAtom(showSnakeGameAtom);
  const [draft, setDraft] = useAtom(checkoutDraftAtom);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!draft || !user?.id) {
      router.replace('/basket');
    }
  }, [draft, user?.id, router]);

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!user?.id || !draft) throw new Error('Нет данных заказа');

      const digits = cardNumber.replace(/\D/g, '');
      if (digits.length !== 16) throw new Error('Введите номер карты из 16 цифр');
      if (!/^\d{2}\/\d{2}$/.test(expiry)) throw new Error('Укажите срок в формате ММ/ГГ');
      if (cvv.replace(/\D/g, '').length !== 3) throw new Error('Введите код из 3 цифр');

      const { data: res } = await axios.post('/api/orders', {
        userId: user.id,
        deliveryType: draft.deliveryType,
        deliveryTime: draft.deliveryTime,
        paymentMethod: 'card',
        bonusUsed: draft.bonusUsed,
        address: draft.address,
      });
      return res;
    },
    onSuccess: (res) => {
      setDraft(null);
      setUser({ ...user, bonuses: res.user?.bonuses ?? user?.bonuses });
      queryClient.invalidateQueries({ queryKey: ['basket', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      setShowSnake(true);
      router.push('/home');
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
            'Не удалось оплатить';
      setError(msg);
    },
  });

  if (!draft) {
    return (
      <div className='min-h-screen bg-[#e8d8c9] flex items-center justify-center px-2'>
        <p className='text-sm'>Перенаправление…</p>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-4 sm:py-8 px-2 min-[375px]:px-4 md:px-8'>
      <div className='max-w-[400px] mx-auto'>
        <Link href='/basket' className='text-xs sm:text-sm underline mb-4 inline-block'>
          ← Назад в корзину
        </Link>

        <div className='bg-white rounded-[12px] sm:rounded-[15px] border border-black p-3 sm:p-5 shadow-grow'>
          <h1 className='text-base sm:text-lg font-medium mb-1'>Оплата картой</h1>
          <p className='text-xs text-gray-600 mb-4'>К оплате: {draft.total}₽</p>

          <div className='flex flex-col gap-3 sm:gap-4'>
            <div>
              <label className='text-[10px] sm:text-xs text-gray-600 mb-1 block'>Номер карты</label>
              <Input
                inputMode='numeric'
                placeholder='1234 5678 9101 1121'
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className='text-sm font-mono tracking-wide'
                maxLength={19}
              />
            </div>

            <div className='grid grid-cols-2 gap-2 sm:gap-3'>
              <div>
                <label className='text-[10px] sm:text-xs text-gray-600 mb-1 block'>Срок службы</label>
                <Input
                  inputMode='numeric'
                  placeholder='11/32'
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className='text-sm font-mono'
                  maxLength={5}
                />
              </div>
              <div>
                <label className='text-[10px] sm:text-xs text-gray-600 mb-1 block'>Код</label>
                <Input
                  inputMode='numeric'
                  type='password'
                  placeholder='123'
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className='text-sm font-mono'
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          <p className='text-[10px] text-gray-500 mt-3 leading-relaxed'>
            Демо-оплата: данные карты не сохраняются и не отправляются в банк.
          </p>

          {error && <p className='text-xs text-red-600 mt-3 break-words'>{error}</p>}

          <Button
            disabled={placeOrder.isPending}
            onClick={() => {
              setError('');
              placeOrder.mutate();
            }}
            className='w-full mt-4 border border-black cursor-pointer hover:bg-[#FDB4B4]/40 text-sm h-10 sm:h-11'>
            {placeOrder.isPending ? 'Обработка…' : `Оплатить ${draft.total}₽`}
          </Button>
        </div>
      </div>
    </div>
  );
};
