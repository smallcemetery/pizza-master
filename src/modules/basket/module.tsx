/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSnakeGameAtom } from '@/store/game';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom, useAtomValue } from 'jotai/react';
import { Trash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useBasket } from './hooks/use-basket';
import { useRemoveBasketItem } from './hooks/use-remove-basket';

const DELIVERY_TIMES = ['Как можно скорее', '12:00–13:00', '13:00–14:00', '18:00–19:00', '19:00–20:00'];

export const BasketModule = () => {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setShowSnake = useSetAtom(showSnakeGameAtom);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useBasket();
  const removeItem = useRemoveBasketItem();

  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [deliveryTime, setDeliveryTime] = useState(DELIVERY_TIMES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'bonus'>('card');
  const [useBonuses, setUseBonuses] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const savedAddress = useMemo(() => {
    const parts = [user?.city, user?.street, user?.home && `д. ${user.home}`, user?.apartment && `кв. ${user.apartment}`].filter(
      Boolean,
    );
    return parts.join(', ');
  }, [user]);

  const [addressChoice, setAddressChoice] = useState<'saved' | 'new'>('saved');

  const subtotal =
    data?.items?.reduce((sum: number, item: any) => sum + item.food.price * item.quantity, 0) ?? 0;
  const maxBonus = Math.min(user?.bonuses ?? 0, subtotal);
  const appliedBonus = useBonuses ? Math.min(bonusAmount, maxBonus) : 0;
  const total = Math.max(0, subtotal - appliedBonus);

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('Сессия истекла. Войдите снова.');
      }

      const address =
        deliveryType === 'pickup'
          ? 'Самовывоз'
          : addressChoice === 'saved'
            ? savedAddress || customAddress
            : customAddress;

      const { data: res } = await axios.post('/api/orders', {
        userId: user.id,
        deliveryType,
        deliveryTime,
        paymentMethod: paymentMethod === 'bonus' && appliedBonus >= subtotal ? 'bonus' : paymentMethod,
        bonusUsed: appliedBonus,
        address,
      });
      return res;
    },
    onSuccess: (res) => {
      setCheckoutError('');
      setUser({ ...user, bonuses: res.user?.bonuses ?? user?.bonuses });
      queryClient.invalidateQueries({ queryKey: ['basket', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      setShowSnake(true);
      router.push('/home');
    },
    onError: (err: any) => {
      const data = err.response?.data;
      setCheckoutError(
        data?.hint
          ? `${data.error}. ${data.hint}`
          : data?.details || data?.error || err.message || 'Не удалось оформить заказ',
      );
    },
  });

  const resolveAddress = () => {
    if (deliveryType === 'pickup') return 'Самовывоз';
    if (addressChoice === 'saved') return savedAddress || customAddress;
    return customAddress;
  };

  const handleCheckout = () => {
    setCheckoutError('');
    if (!data?.items?.length) {
      setCheckoutError('Корзина пуста');
      return;
    }
    if (!user?.id) {
      setCheckoutError('Войдите в аккаунт заново');
      return;
    }
    if (deliveryType === 'courier') {
      const addr = resolveAddress().trim();
      if (!addr) {
        setCheckoutError('Укажите адрес доставки');
        return;
      }
    }
    placeOrder.mutate();
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-[#e8d8c9] flex items-center justify-center px-4'>
        <p className='text-sm'>Загрузка корзины...</p>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] flex flex-col lg:flex-row px-3 min-[375px]:px-4 min-[425px]:px-5 md:px-8 lg:px-12 xl:px-[100px] gap-5 md:gap-8 py-6 md:py-10'>
      <div className='flex-1 flex flex-col gap-4 min-w-0'>
        <h1 className='text-lg md:text-xl'>Корзина</h1>
        {!data?.items?.length ? (
          <div className='bg-white rounded-[15px] border border-black p-6 md:p-8 text-center'>
            <p className='text-sm mb-4'>Корзина пуста</p>
            <Link href='/home'>
              <Button className='border border-black cursor-pointer'>В меню</Button>
            </Link>
          </div>
        ) : (
          data.items.map((item: any) => (
            <div
              key={item.id}
              className='rounded-[10px] border border-black bg-white px-3 py-3 sm:px-5 sm:py-4 flex gap-3 items-center min-w-0'>
              <div className='size-16 sm:size-20 rounded-full bg-[#FDB4B4]/30 border border-dashed border-black shrink-0 overflow-hidden flex items-center justify-center text-[10px]'>
                {item.food.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.food.image} alt='' className='size-full object-cover' />
                ) : (
                  'фото'
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-sm font-medium truncate'>{item.food.name}</h2>
                <p className='text-xs text-gray-500 mt-1 line-clamp-2'>{item.food.compound}</p>
              </div>
              <div className='text-right shrink-0 flex flex-col items-end gap-2'>
                <div>
                  <p className='text-sm'>{item.food.price}₽</p>
                  <p className='text-xs'>× {item.quantity}</p>
                </div>
                <button
                  type='button'
                  aria-label='Удалить'
                  disabled={removeItem.isPending}
                  onClick={() => removeItem.mutate(item.id)}
                  className='p-1.5 border border-black rounded hover:bg-red-50 cursor-pointer disabled:opacity-50'>
                  <Trash size={18} weight='bold' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='w-full lg:w-[min(380px,100%)] lg:max-w-[400px] flex flex-col gap-3 md:gap-4 shrink-0'>
        <div className='bg-white rounded-[15px] border border-black p-4 md:p-5 flex flex-col gap-3'>
          <h2 className='font-medium text-sm md:text-base'>Способ получения</h2>
          <div className='flex gap-2'>
            <Button
              type='button'
              onClick={() => setDeliveryType('courier')}
              className={`flex-1 border border-black cursor-pointer text-xs sm:text-sm ${
                deliveryType === 'courier' ? 'bg-[#FDB4B4]/50 text-black' : 'bg-transparent text-black hover:bg-slate-100'
              }`}>
              Доставка
            </Button>
            <Button
              type='button'
              onClick={() => setDeliveryType('pickup')}
              className={`flex-1 border border-black cursor-pointer text-xs sm:text-sm ${
                deliveryType === 'pickup' ? 'bg-[#FDB4B4]/50 text-black' : 'bg-transparent text-black hover:bg-slate-100'
              }`}>
              Самовывоз
            </Button>
          </div>
          <h2 className='font-medium text-sm'>Время</h2>
          <select
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className='w-full border border-black px-3 py-2 text-sm bg-[#FFF3E6]'>
            {DELIVERY_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {deliveryType === 'courier' && (
          <div className='bg-white rounded-[15px] border border-black p-4 md:p-5 flex flex-col gap-2'>
            <h2 className='font-medium text-sm'>Адрес</h2>
            {savedAddress && (
              <label className='flex items-start gap-2 text-xs sm:text-sm cursor-pointer'>
                <input
                  type='radio'
                  className='mt-1 shrink-0'
                  checked={addressChoice === 'saved'}
                  onChange={() => setAddressChoice('saved')}
                />
                <span className='line-clamp-3'>{savedAddress}</span>
              </label>
            )}
            <label className='flex items-center gap-2 text-xs sm:text-sm cursor-pointer'>
              <input type='radio' checked={addressChoice === 'new'} onChange={() => setAddressChoice('new')} />
              Другой адрес
            </label>
            {addressChoice === 'new' && (
              <Input
                placeholder='Город, улица, дом, квартира'
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className='text-sm'
              />
            )}
          </div>
        )}

        <div className='bg-white rounded-[15px] border border-black p-4 md:p-5 flex flex-col gap-2'>
          <h2 className='font-medium text-sm'>Оплата</h2>
          {(['card', 'cash', 'bonus'] as const).map((method) => (
            <label key={method} className='flex items-center gap-2 text-xs sm:text-sm cursor-pointer'>
              <input
                type='radio'
                name='payment'
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {method === 'card' && 'Картой онлайн'}
              {method === 'cash' && 'Наличными курьеру'}
              {method === 'bonus' && 'Списать бонусы'}
            </label>
          ))}
          {(paymentMethod === 'bonus' || useBonuses) && (user?.bonuses ?? 0) > 0 && (
            <div className='mt-1 pl-1'>
              <label className='flex items-center gap-2 text-xs mb-2'>
                <input type='checkbox' checked={useBonuses} onChange={(e) => setUseBonuses(e.target.checked)} />
                Использовать бонусы (доступно: {user?.bonuses ?? 0})
              </label>
              {useBonuses && (
                <Input
                  type='number'
                  min={0}
                  max={maxBonus}
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Math.min(Number(e.target.value), maxBonus))}
                  placeholder={`До ${maxBonus} бонусов`}
                  className='text-sm'
                />
              )}
            </div>
          )}
        </div>

        <div className='bg-[#FFF3E6] rounded-[15px] border border-black p-4 md:p-5'>
          <div className='flex justify-between text-sm mb-1'>
            <span>Сумма</span>
            <span>{subtotal}₽</span>
          </div>
          {appliedBonus > 0 && (
            <div className='flex justify-between text-sm mb-1 text-green-700'>
              <span>Бонусы</span>
              <span>−{appliedBonus}₽</span>
            </div>
          )}
          <div className='flex justify-between font-medium mt-2 pt-2 border-t border-black text-sm md:text-base'>
            <span>Итого</span>
            <span>{total}₽</span>
          </div>
          <Button
            disabled={!data?.items?.length || placeOrder.isPending}
            onClick={handleCheckout}
            className='w-full mt-4 border border-black cursor-pointer hover:bg-[#FDB4B4]/40 disabled:opacity-50'>
            {placeOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
          </Button>
          {(checkoutError || placeOrder.isError) && (
            <p className='text-xs text-red-600 mt-2 break-words'>{checkoutError || 'Ошибка оформления'}</p>
          )}
        </div>
      </div>
    </div>
  );
};
