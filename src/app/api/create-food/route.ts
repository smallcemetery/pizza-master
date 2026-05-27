/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/shared/utils/db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Инициализация Supabase (лучше вынести в отдельный файл utils)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Используй Service Role для обхода политик RLS при записи
);

export async function POST(req: Request) {
  try {
    // 1. Получаем данные из FormData
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const compound = formData.get('compound') as string;
    const price = Number(formData.get('price'));
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;

    // 2. Если есть файл, загружаем его в Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`; // Генерируем уникальное имя
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food_images') // Твой бакет
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('ПОЛНАЯ ОШИБКА SUPABASE:', uploadError);
        return NextResponse.json(
          {
            message: 'Ошибка Supabase Storage',
            details: uploadError.message,
          },
          { status: 500 },
        );
      }

      // Получаем публичную ссылку на файл
      const {
        data: { publicUrl },
      } = supabase.storage.from('food_images').getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // 3. Создаем запись в базе через Prisma
    const newFood = await prisma.food.create({
      data: {
        name,
        category,
        compound,
        price,
        image: imageUrl, // Сохраняем ссылку
      },
    });

    return NextResponse.json(newFood, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || 'Ошибка сервера' }, { status: 500 });
  }
}
