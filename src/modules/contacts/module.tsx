export const ContactsModule = () => {
  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] py-[50px] px-[100px]'>
      <div className='max-w-[900px] mx-auto flex flex-col gap-[30px]'>
        <div className='bg-white rounded-[15px] border border-black p-[30px] shadow-grow'>
          <h1 className='text-2xl mb-[15px]'>Контакты</h1>
          <p className='text-sm leading-6 mb-[20px]'>Свяжитесь с нами любым удобным способом — мы всегда на связи!</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-[20px] text-sm'>
            <div className='bg-[#FFF3E6] p-[15px] rounded-[10px] border border-black'>
              <p className='font-medium mb-[5px]'>Телефон</p>
              <p>+7 (900) 123-45-67</p>
            </div>
            <div className='bg-[#FFF3E6] p-[15px] rounded-[10px] border border-black'>
              <p className='font-medium mb-[5px]'>Email</p>
              <p>hello@pizza-master.ru</p>
            </div>
            <div className='bg-[#FFF3E6] p-[15px] rounded-[10px] border border-black'>
              <p className='font-medium mb-[5px]'>Адрес</p>
              <p>г. Москва, ул. Пиццерийная, д. 1</p>
            </div>
            <div className='bg-[#FFF3E6] p-[15px] rounded-[10px] border border-black'>
              <p className='font-medium mb-[5px]'>Время работы</p>
              <p>Ежедневно с 10:00 до 23:00</p>
            </div>
          </div>
        </div>

        <div className='bg-[#FFF3E6] rounded-[15px] border border-black p-[20px]'>
          <div className='w-full h-[250px] rounded-[10px] bg-[#e8d8c9] border border-dashed border-black flex items-center justify-center text-xs text-center px-4'>
            {/* Вставьте карту или фото офиса */}
            Место для карты или фото
          </div>
          <p className='text-xs mt-[10px] text-center'>Приезжайте в гости — угощаем чаем, пока готовится заказ!</p>
        </div>
      </div>
    </div>
  );
};
