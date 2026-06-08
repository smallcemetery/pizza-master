'use client';
import { mergeGuestBasketToServer } from '@/shared/utils/merge-guest-basket';
import { guestBasketAtom } from '@/store/guest-basket';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom, useSetAtom } from 'jotai/react';
import { useRouter } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAuth = () => {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const [guestBasket, setGuestBasket] = useAtom(guestBasketAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth'],
    mutationFn: async (data: any) => {
      const { data: back } = await axios.post('/api/authorization', data);
      return back;
    },
    onSuccess: async (back) => {
      setUser(back.user);

      if (guestBasket.length > 0) {
        await mergeGuestBasketToServer(back.user.id, guestBasket);
        setGuestBasket([]);
        queryClient.invalidateQueries({ queryKey: ['basket', back.user.id] });
      }

      const next = new URLSearchParams(window.location.search).get('next') || '/home';
      router.push(next);
      router.refresh();
    },
    onError: (error: any) => {
      console.log(error.response?.data?.message || 'Ошибка при входе');
    },
  });
};
