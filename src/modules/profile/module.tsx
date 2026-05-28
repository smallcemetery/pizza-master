'use client';
import { profileAvatarAtom } from '@/store/profile-avatar';
import { userAtom } from '@/store/user';
import { useAtom, useAtomValue } from 'jotai/react';
import Link from 'next/link';
import { useRef } from 'react';
import { useActions, useOrders } from './hooks/use-profile';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает подтверждения',
  PREPARING: 'Готовится',
  DELIVERING: 'В пути',
  COMPLETED: 'Доставлен',
  CANCELLED: 'Отменён',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100',
  PREPARING: 'bg-[#FDB4B4]/40',
  DELIVERING: 'bg-[#BFACC0]/40',
  COMPLETED: 'bg-green-100',
  CANCELLED: 'bg-gray-200',
};

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const ProfileModule = () => {
  const user = useAtomValue(userAtom);
  const [avatar, setAvatar] = useAtom(profileAvatarAtom);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: actions, isLoading: actionsLoading } = useActions();

  const bonuses = user?.bonuses ?? 0;
  const addressParts = [user?.city, user?.street, user?.home, user?.apartment].filter(Boolean);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Выберите файл изображения (JPG, PNG, WebP)');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      alert('Файл слишком большой (максимум 2 МБ)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-6 md:py-10 px-3 min-[375px]:px-4 min-[425px]:px-5 md:px-8 lg:px-12 xl:px-[100px]'>
      <div className='max-w-[1000px] mx-auto flex flex-col gap-5 md:gap-6'>
        <div className='flex flex-col sm:flex-row gap-4 md:gap-5 items-center sm:items-start'>
          <div className='relative shrink-0'>
            <div className='size-[100px] sm:size-[120px] rounded-full bg-[#FDB4B4]/40 border-2 border-black flex items-center justify-center overflow-hidden'>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt='Аватар' className='size-full object-cover' />
              ) : (
                <span className='text-xs text-center px-2'>Нет фото</span>
              )}
            </div>
            <input
              ref={fileRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleAvatarChange}
            />
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='mt-2 w-full text-xs border border-black px-2 py-1.5 bg-white hover:bg-[#FFF3E6] cursor-pointer'>
              Выбрать фото
            </button>
            {avatar && (
              <button
                type='button'
                onClick={() => setAvatar(null)}
                className='mt-1 w-full text-xs text-red-700 underline cursor-pointer'>
                Удалить фото
              </button>
            )}
          </div>
          <div className='flex-1 w-full bg-white rounded-[15px] border border-black p-4 md:p-6 shadow-grow min-w-0'>
            <h1 className='text-lg md:text-xl mb-1'>Профиль</h1>
            <p className='text-sm text-gray-600 mb-3 break-all'>{user?.email}</p>
            {addressParts.length > 0 && (
              <p className='text-xs mb-3 line-clamp-2'>Адрес: {addressParts.join(', ')}</p>
            )}
            <div className='inline-flex items-center gap-3 bg-[#FFF3E6] border border-black rounded-full px-4 py-2'>
              <span className='text-xl'>🍕</span>
              <div>
                <p className='text-xs text-gray-500'>Бонусные баллы</p>
                <p className='text-lg md:text-xl font-medium'>{bonuses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-[15px] border border-black p-4 md:p-6'>
          <h2 className='text-base md:text-lg mb-4'>Мои заказы</h2>
          {ordersLoading && <p className='text-sm'>Загрузка заказов...</p>}
          {!ordersLoading && (!orders || orders.length === 0) && (
            <p className='text-sm text-gray-500'>
              Заказов пока нет.{' '}
              <Link href='/home' className='underline hover:text-[#FDB4B4]'>
                Перейти в меню
              </Link>
            </p>
          )}
          <div className='flex flex-col gap-3'>
            {orders?.map(
              (order: {
                id: string;
                status: string;
                total: number;
                createdAt: string;
                deliveryType: string;
                items: { foodName: string; quantity: number; price: number }[];
              }) => (
                <div key={order.id} className='border border-black rounded-[10px] p-3 md:p-4 bg-[#FFF3E6] min-w-0'>
                  <div className='flex flex-col xs:flex-row justify-between gap-2 mb-2'>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium'>Заказ #{order.id.slice(-6).toUpperCase()}</p>
                      <p className='text-xs text-gray-500'>
                        {new Date(order.createdAt).toLocaleString('ru-RU')} ·{' '}
                        {order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border border-black self-start shrink-0 ${STATUS_COLORS[order.status] ?? ''}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <ul className='text-xs flex flex-col gap-1 mb-2'>
                    {order.items.map((item, i) => (
                      <li key={i} className='truncate'>
                        {item.foodName} × {item.quantity} — {item.price * item.quantity}₽
                      </li>
                    ))}
                  </ul>
                  <p className='text-sm font-medium'>Итого: {order.total}₽</p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className='bg-white rounded-[15px] border border-black p-4 md:p-6'>
          <h2 className='text-base md:text-lg mb-4'>Акции</h2>
          {actionsLoading && <p className='text-sm'>Загрузка акций...</p>}
          {!actionsLoading && (!actions || actions.length === 0) && (
            <p className='text-sm text-gray-500'>Скоро появятся новые акции — следите за историями на главной!</p>
          )}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {actions?.map((action: { id: string; name: string; description: string; image: string }) => (
              <div key={action.id} className='border border-black rounded-[10px] overflow-hidden bg-[#FFF3E6] min-w-0'>
                <div className='h-[100px] sm:h-[120px] bg-[#FDB4B4]/20 border-b border-black'>
                  {action.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={action.image} alt={action.name} className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-xs'>Фото акции</div>
                  )}
                </div>
                <div className='p-3'>
                  <p className='font-medium text-sm truncate'>{action.name}</p>
                  <p className='text-xs mt-1 line-clamp-3'>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
