import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function requireAdminApi() {
  const store = await cookies();
  if (store.get('admin')?.value !== 'true') {
    return NextResponse.json({ error: 'Доступ только для администратора' }, { status: 403 });
  }
  return null;
}
