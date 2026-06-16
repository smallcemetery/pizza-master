import mesto from '@/assets/mesto.png';
import team from '@/assets/team.png';
import { PageCard, PageCardAccent, PageShell } from '@/shared/ui/page-shell';

export const AboutModule = () => {
  return (
    <PageShell>
      <PageCard>
        <h1 className='text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4'>О нас</h1>
        <p className='text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4'>
          Добро пожаловать в нашу пиццерию! Мы готовим пиццу из свежих ингредиентов в духе домашней кухни — с тёплой
          атмосферой и заботой о каждом госте.
        </p>
        <p className='text-xs sm:text-sm leading-relaxed'>
          Наша команда любит экспериментировать с начинками и делать заказ простым: выбирайте любимые позиции, копите
          бонусы и получайте радость с каждой доставкой.
        </p>
      </PageCard>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
        <PageCardAccent className='flex flex-col gap-2 sm:gap-3'>
          <div className='w-full h-[140px] sm:h-[180px] rounded-[10px] overflow-hidden border border-black'>
            <img src={team.src} alt='Наша команда' className='w-full h-full object-cover' loading='eager' />
          </div>
          <h2 className='font-medium text-sm sm:text-base'>Наша команда</h2>
          <p className='text-[11px] sm:text-xs leading-relaxed'>
            Пекари и курьеры, которые каждый день стараются сделать ваш вечер вкуснее.
          </p>
        </PageCardAccent>
        <PageCardAccent className='flex flex-col gap-2 sm:gap-3'>
          <div className='w-full h-[140px] sm:h-[180px] rounded-[10px] overflow-hidden border border-black'>
            <img src={mesto.src} alt='Наша кухня' className='w-full h-full object-cover' loading='eager' />
          </div>
          <h2 className='font-medium text-sm sm:text-base'>Наша кухня</h2>
          <p className='text-[11px] sm:text-xs leading-relaxed'>
            Тесто замешиваем ежедневно, соусы готовим сами, сыр — только качественный.
          </p>
        </PageCardAccent>
      </div>

      <PageCard>
        <h2 className='text-sm sm:text-base mb-2 sm:mb-3'>Почему мы</h2>
        <ul className='text-xs sm:text-sm flex flex-col gap-1.5 sm:gap-2 list-disc pl-4 sm:pl-5'>
          <li>Свежие продукты каждый день</li>
          <li>Быстрая доставка по городу</li>
          <li>Бонусная программа и мини-игры</li>
          <li>Уютный мультяшный стиль — как в любимых мультфильмах</li>
        </ul>
      </PageCard>
    </PageShell>
  );
};
