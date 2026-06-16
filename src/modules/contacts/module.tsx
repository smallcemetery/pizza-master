import kitchen from '@/assets/kitchen.png';
import { PageCard, PageCardAccent, PageShell } from '@/shared/ui/page-shell';

export const ContactsModule = () => {
  return (
    <PageShell>
      <PageCard>
        <h1 className='text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4'>Контакты</h1>
        <p className='text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5'>
          Свяжитесь с нами любым удобным способом — мы всегда на связи!
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm'>
          <div className='bg-[#FFF3E6] p-3 sm:p-4 rounded-[10px] border border-black min-w-0'>
            <p className='font-medium mb-1'>Телефон</p>
            <p className='break-all'>+7 (900) 123-45-67</p>
          </div>
          <div className='bg-[#FFF3E6] p-3 sm:p-4 rounded-[10px] border border-black min-w-0'>
            <p className='font-medium mb-1'>Email</p>
            <p className='break-all'>hello@pizza-master.ru</p>
          </div>
          <div className='bg-[#FFF3E6] p-3 sm:p-4 rounded-[10px] border border-black min-w-0'>
            <p className='font-medium mb-1'>Адрес</p>
            <p>г. Москва, ул. Пиццерийная, д. 1</p>
          </div>
          <div className='bg-[#FFF3E6] p-3 sm:p-4 rounded-[10px] border border-black min-w-0'>
            <p className='font-medium mb-1'>Время работы</p>
            <p>Ежедневно с 10:00 до 23:00</p>
          </div>
        </div>
      </PageCard>

      <PageCardAccent>
        <div className='w-full h-[180px] sm:h-[250px] rounded-[10px] overflow-hidden border border-black'>
          <img src={kitchen.src} alt='Наша кухня' className='w-full h-full object-cover' loading='eager' />
        </div>
        <p className='text-[10px] sm:text-xs mt-2 sm:mt-3 text-center'>
          Приезжайте в гости — угощаем чаем, пока готовится заказ!
        </p>
      </PageCardAccent>
    </PageShell>
  );
};
