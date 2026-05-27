/* eslint-disable @typescript-eslint/no-explicit-any */
import { userAtom } from '@/store/user';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom } from 'jotai/react';
import { useRouter } from 'next/navigation';

export const useReg = () => {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationKey: ['reg'],
    mutationFn: async (data: any) => {
      const { data: back } = await axios.post('/api/registration', data);
      console.log(back, 'данные юзера из хука регистрации:');

      return back;
    },
    onSuccess: (back) => {
      // После успешной регистрации и установки куки в API
      // мидлвара пропустит нас на главную
      setUser(back.user);
      router.push('/home');
      router.refresh(); // Обновляем состояние сервера, чтобы мидлвара увидела новую куку
    },
    onError: (error) => {
      console.error('Ошибка регистрации:', error);
    },
  });
};
