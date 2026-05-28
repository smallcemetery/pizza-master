export const AboutModule = () => {
  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-[50px] px-[100px]'>
      <div className='max-w-[900px] mx-auto flex flex-col gap-[30px]'>
        <div className='bg-white rounded-[15px] border border-black p-[30px] shadow-grow'>
          <h1 className='text-2xl mb-[15px]'>О нас</h1>
          <p className='text-sm leading-6 mb-[15px]'>
            Добро пожаловать в нашу пиццерию! Мы готовим пиццу из свежих ингредиентов в духе домашней кухни — с тёплой
            атмосферой и заботой о каждом госте.
          </p>
          <p className='text-sm leading-6'>
            Наша команда любит экспериментировать с начинками и делать заказ простым: выбирайте любимые позиции, копите
            бонусы и получайте радость с каждой доставкой.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
          <div className='bg-[#FFF3E6] rounded-[15px] border border-black p-[20px] flex flex-col gap-[10px]'>
            <div className='w-full h-[180px] rounded-[10px] bg-[#FDB4B4]/30 border border-dashed border-black flex items-center justify-center text-xs text-center px-4'>
              {/* Вставьте своё фото */}
              Место для фото команды
            </div>
            <h2 className='font-medium'>Наша команда</h2>
            <p className='text-xs leading-5'>Пекари и курьеры, которые каждый день стараются сделать ваш вечер вкуснее.</p>
          </div>
          <div className='bg-[#FFF3E6] rounded-[15px] border border-black p-[20px] flex flex-col gap-[10px]'>
            <div className='w-full h-[180px] rounded-[10px] bg-[#BFACC0]/30 border border-dashed border-black flex items-center justify-center text-xs text-center px-4'>
              Место для фото пиццерии
            </div>
            <h2 className='font-medium'>Наша кухня</h2>
            <p className='text-xs leading-5'>Тесто замешиваем ежедневно, соусы готовим сами, сыр — только качественный.</p>
          </div>
        </div>

        <div className='bg-white rounded-[15px] border border-black p-[25px]'>
          <h2 className='mb-[10px]'>Почему мы</h2>
          <ul className='text-sm flex flex-col gap-[8px] list-disc pl-[20px]'>
            <li>Свежие продукты каждый день</li>
            <li>Быстрая доставка по городу</li>
            <li>Бонусная программа и мини-игры</li>
            <li>Уютный мультяшный стиль — как в любимых мультфильмах</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
