'use client';
import { userAtom } from '@/store/user';
import { useAtomValue } from 'jotai/react';
import Link from 'next/link';
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

export const ProfileModule = () => {
  const user = useAtomValue(userAtom);
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: actions, isLoading: actionsLoading } = useActions();

  const bonuses = user?.bonuses ?? 0;
  const addressParts = [user?.city, user?.street, user?.home, user?.apartment].filter(Boolean);

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-[40px] px-[100px]'>
      <div className='max-w-[1000px] mx-auto flex flex-col gap-[25px]'>
        <div className='flex flex-col sm:flex-row gap-[20px] items-start'>
          <div className='size-[120px] rounded-full bg-[#FDB4B4]/40 border-2 border-black flex items-center justify-center text-xs text-center shrink-0'>
            {/* Вставьте аватар */}
            Фото профиля
          </div>
          <div className='flex-1 bg-white rounded-[15px] border border-black p-[25px] shadow-grow'>
            <h1 className='text-xl mb-[5px]'>Профиль</h1>
            <p className='text-sm text-gray-600 mb-[15px]'>{user?.email}</p>
            {addressParts.length > 0 && (
              <p className='text-xs mb-[10px]'>Адрес: {addressParts.join(', ')}</p>
            )}
            <div className='inline-flex items-center gap-[10px] bg-[#FFF3E6] border border-black rounded-full px-[20px] py-[8px]'>
              <span className='text-2xl'>🍕</span>
              <div>
                <p className='text-xs text-gray-500'>Бонусные баллы</p>
                <p className='text-xl font-medium'>{bonuses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-[15px] border border-black p-[25px]'>
          <h2 className='text-lg mb-[15px]'>Мои заказы</h2>
          {ordersLoading && <p className='text-sm'>Загрузка заказов...</p>}
          {!ordersLoading && (!orders || orders.length === 0) && (
            <p className='text-sm text-gray-500'>
              Заказов пока нет.{' '}
              <Link href='/home' className='underline hover:text-[#FDB4B4]'>
                Перейти в меню
              </Link>
            </p>
          )}
          <div className='flex flex-col gap-[12px]'>
            {orders?.map(
              (order: {
                id: string;
                status: string;
                total: number;
                createdAt: string;
                deliveryType: string;
                items: { foodName: string; quantity: number; price: number }[];
              }) => (
                <div key={order.id} className='border border-black rounded-[10px] p-[15px] bg-[#FFF3E6]'>
                  <div className='flex justify-between items-start mb-[10px]'>
                    <div>
                      <p className='text-sm font-medium'>Заказ #{order.id.slice(-6).toUpperCase()}</p>
                      <p className='text-xs text-gray-500'>
                        {new Date(order.createdAt).toLocaleString('ru-RU')} ·{' '}
                        {order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-[10px] py-[4px] rounded-full border border-black ${STATUS_COLORS[order.status] ?? ''}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <ul className='text-xs flex flex-col gap-[4px] mb-[8px]'>
                    {order.items.map((item, i) => (
                      <li key={i}>
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

        <div className='bg-white rounded-[15px] border border-black p-[25px]'>
          <h2 className='text-lg mb-[15px]'>Акции</h2>
          {actionsLoading && <p className='text-sm'>Загрузка акций...</p>}
          {!actionsLoading && (!actions || actions.length === 0) && (
            <p className='text-sm text-gray-500'>Скоро появятся новые акции — следите за историями на главной!</p>
          )}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-[15px]'>
            {actions?.map((action: { id: string; name: string; description: string; image: string }) => (
              <div key={action.id} className='border border-black rounded-[10px] overflow-hidden bg-[#FFF3E6]'>
                <div className='h-[120px] bg-[#FDB4B4]/20 border-b border-black flex items-center justify-center text-xs'>
                  {action.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={action.image} alt={action.name} className='w-full h-full object-cover' />
                  ) : (
                    'Фото акции'
                  )}
                </div>
                <div className='p-[12px]'>
                  <p className='font-medium text-sm'>{action.name}</p>
                  <p className='text-xs mt-[5px]'>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
