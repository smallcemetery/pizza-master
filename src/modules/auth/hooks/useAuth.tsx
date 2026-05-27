/* eslint-disable @typescript-eslint/no-explicit-any */
import { userAtom } from '@/store/user';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom } from 'jotai/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationKey: ['auth'],
    mutationFn: async (data: any) => {
      // Отправляем запрос на эндпоинт авторизации
      const { data: back } = await axios.post('http://localhost:3000/api/authorization', data);
      console.log(back, 'данные пользователя после авторизации:');

      return back;
    },
    onSuccess: (back) => {
      // Кука уже установлена сервером в ответе (Set-Cookie)
      // Перенаправляем на главную
      setUser(back.user);
      router.push('/home');
      router.refresh(); // Важно, чтобы middleware пересчитала доступ
    },
    onError: (error: any) => {
      // Выводим ошибку (например, "Неверный пароль")
      console.log(error.response?.data?.message || 'Ошибка при входе');
    },
  });
};
