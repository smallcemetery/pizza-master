'use client';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';

type AddBasketPayload = {
  foodId: string;
  quantity?: number;
};

export const useAddBasket = () => {
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  return useMutation({
    mutationKey: ['addBasket'],
    mutationFn: async ({ foodId, quantity = 1 }: AddBasketPayload) => {
      if (!userId) {
        throw new Error('Сначала войдите в аккаунт');
      }
      const { data } = await axios.post('/api/add-basket', { userId, foodId, quantity });
      return data;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['basket', userId] });
      }
    },
  });
};

/** @deprecated используйте useAddBasket */
export const addBusket = useAddBasket;
