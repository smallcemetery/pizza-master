/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';

export const addBusket = () => {
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const userId = user.id;

  return useMutation({
    mutationKey: ['addBasket'],
    mutationFn: async (foodId: string) => {
      const { data } = await axios.post('http://localhost:3000/api/add-basket', { userId, foodId });

      return data;
    },
    onSuccess: () => {
      // Инвалидируем кеш, чтобы обновить список товаров на экране
      queryClient.invalidateQueries({ queryKey: ['basket', userId] });
    },
    onError: (err) => {
      console.log(err, 'ошибка добавления карзины');
    },
  });
};
