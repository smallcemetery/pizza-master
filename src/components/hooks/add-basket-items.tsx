'use client';
import { guestBasketAtom } from '@/store/guest-basket';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai/react';

type AddBasketPayload = {
  foodId: string;
  quantity?: number;
};

export const useAddBasket = () => {
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const [guestBasket, setGuestBasket] = useAtom(guestBasketAtom);
  const userId = user?.id;

  return useMutation({
    mutationKey: ['addBasket'],
    mutationFn: async ({ foodId, quantity = 1 }: AddBasketPayload) => {
      if (!userId) {
        setGuestBasket((prev) => {
          const existing = prev.find((i) => i.foodId === foodId);
          if (existing) {
            return prev.map((i) =>
              i.foodId === foodId ? { ...i, quantity: i.quantity + quantity } : i,
            );
          }
          return [...prev, { foodId, quantity }];
        });
        return { guest: true };
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
