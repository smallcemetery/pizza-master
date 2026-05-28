import { prisma } from '@/shared/utils/db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !description) {
      return NextResponse.json({ message: 'Нужны название и описание' }, { status: 400 });
    }

    let imageUrl = '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `action-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('food_images').upload(fileName, imageFile);

      if (uploadError) {
        return NextResponse.json({ message: uploadError.message }, { status: 500 });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('food_images').getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    const action = await prisma.action.create({
      data: { name, description, image: imageUrl || '/placeholder-action.png' },
    });

    return NextResponse.json(action, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка сервера';
    return NextResponse.json({ message }, { status: 500 });
  }
}
