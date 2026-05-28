/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSnakeGameAtom } from '@/store/game';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom, useAtomValue } from 'jotai/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useBasket } from './hooks/use-basket';

const DELIVERY_TIMES = ['Как можно скорее', '12:00–13:00', '13:00–14:00', '18:00–19:00', '19:00–20:00'];

export const BasketModule = () => {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setShowSnake = useSetAtom(showSnakeGameAtom);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useBasket();

  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [deliveryTime, setDeliveryTime] = useState(DELIVERY_TIMES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'bonus'>('card');
  const [useBonuses, setUseBonuses] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [customAddress, setCustomAddress] = useState('');

  const savedAddress = useMemo(() => {
    const parts = [user?.city, user?.street, `д. ${user?.home}`, user?.apartment && `кв. ${user.apartment}`].filter(
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
      const address =
        deliveryType === 'pickup'
          ? 'Самовывоз'
          : addressChoice === 'saved'
            ? savedAddress || customAddress
            : customAddress;

      const { data: res } = await axios.post('/api/orders', {
        userId: user?.id,
        deliveryType,
        deliveryTime,
        paymentMethod: paymentMethod === 'bonus' && appliedBonus >= subtotal ? 'bonus' : paymentMethod,
        bonusUsed: appliedBonus,
        address,
      });
      return res;
    },
    onSuccess: (res) => {
      setUser({ ...user, bonuses: res.user?.bonuses ?? user?.bonuses });
      queryClient.invalidateQueries({ queryKey: ['basket', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      setShowSnake(true);
      router.push('/home');
    },
  });

  const handleCheckout = () => {
    if (!data?.items?.length) return;
    if (deliveryType === 'courier' && !savedAddress && !customAddress) return;
    placeOrder.mutate();
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-[#e8d8c9] flex items-center justify-center'>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] flex flex-col lg:flex-row px-[50px] lg:px-[100px] gap-[30px] py-[40px]'>
      <div className='flex-1 flex flex-col gap-[20px]'>
        <h1 className='text-xl'>Корзина</h1>
        {!data?.items?.length ? (
          <div className='bg-white rounded-[15px] border border-black p-[30px] text-center'>
            <p className='text-sm mb-[15px]'>Корзина пуста</p>
            <Link href='/home'>
              <Button className='border border-black cursor-pointer'>В меню</Button>
            </Link>
          </div>
        ) : (
          data.items.map((item: any) => (
            <div
              key={item.id}
              className='rounded-[10px] border border-black bg-white px-[20px] py-[15px] flex justify-between items-center gap-[15px]'>
              <div className='size-[80px] rounded-full bg-[#FDB4B4]/30 border border-dashed border-black shrink-0 flex items-center justify-center text-[10px] text-center'>
                {item.food.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.food.image} alt='' className='size-full rounded-full object-cover' />
                ) : (
                  'фото'
                )}
              </div>
              <div className='flex-1'>
                <h2 className='text-sm font-medium'>{item.food.name}</h2>
                <p className='text-xs text-gray-500 mt-[4px]'>{item.food.compound}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm'>{item.food.price}₽</p>
                <p className='text-xs'>× {item.quantity}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='w-full lg:w-[380px] flex flex-col gap-[15px]'>
        <div className='bg-white rounded-[15px] border border-black p-[20px] flex flex-col gap-[12px]'>
          <h2 className='font-medium'>Способ получения</h2>
          <div className='flex gap-[10px]'>
            <Button
              type='button'
              onClick={() => setDeliveryType('courier')}
              className={`flex-1 border border-black cursor-pointer ${deliveryType === 'courier' ? 'bg-[#FDB4B4]/50' : 'bg-transparent text-black hover:bg-slate-100'}`}>
              Доставка
            </Button>
            <Button
              type='button'
              onClick={() => setDeliveryType('pickup')}
              className={`flex-1 border border-black cursor-pointer ${deliveryType === 'pickup' ? 'bg-[#FDB4B4]/50' : 'bg-transparent text-black hover:bg-slate-100'}`}>
              Самовывоз
            </Button>
          </div>

          <h2 className='font-medium mt-[5px]'>Время</h2>
          <select
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className='w-full border border-black px-[10px] py-[8px] text-sm bg-[#FFF3E6]'>
            {DELIVERY_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {deliveryType === 'courier' && (
          <div className='bg-white rounded-[15px] border border-black p-[20px] flex flex-col gap-[10px]'>
            <h2 className='font-medium'>Адрес</h2>
            {savedAddress && (
              <label className='flex items-center gap-[8px] text-sm cursor-pointer'>
                <input
                  type='radio'
                  checked={addressChoice === 'saved'}
                  onChange={() => setAddressChoice('saved')}
                />
                {savedAddress}
              </label>
            )}
            <label className='flex items-center gap-[8px] text-sm cursor-pointer'>
              <input type='radio' checked={addressChoice === 'new'} onChange={() => setAddressChoice('new')} />
              Другой адрес
            </label>
            {addressChoice === 'new' && (
              <Input
                placeholder='Город, улица, дом, квартира'
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
              />
            )}
          </div>
        )}

        <div className='bg-white rounded-[15px] border border-black p-[20px] flex flex-col gap-[10px]'>
          <h2 className='font-medium'>Оплата</h2>
          {(['card', 'cash', 'bonus'] as const).map((method) => (
            <label key={method} className='flex items-center gap-[8px] text-sm cursor-pointer'>
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
            <div className='mt-[5px] pl-[5px]'>
              <label className='flex items-center gap-[8px] text-xs mb-[8px]'>
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
                />
              )}
            </div>
          )}
        </div>

        <div className='bg-[#FFF3E6] rounded-[15px] border border-black p-[20px]'>
          <div className='flex justify-between text-sm mb-[5px]'>
            <span>Сумма</span>
            <span>{subtotal}₽</span>
          </div>
          {appliedBonus > 0 && (
            <div className='flex justify-between text-sm mb-[5px] text-green-700'>
              <span>Бонусы</span>
              <span>−{appliedBonus}₽</span>
            </div>
          )}
          <div className='flex justify-between font-medium mt-[10px] pt-[10px] border-t border-black'>
            <span>Итого</span>
            <span>{total}₽</span>
          </div>
          <Button
            disabled={!data?.items?.length || placeOrder.isPending}
            onClick={handleCheckout}
            className='w-full mt-[15px] border border-black cursor-pointer hover:bg-[#FDB4B4]/40 disabled:opacity-50'>
            {placeOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
          </Button>
          {placeOrder.isError && (
            <p className='text-xs text-red-600 mt-[8px]'>Не удалось оформить заказ. Попробуйте снова.</p>
          )}
        </div>
      </div>
    </div>
  );
};
