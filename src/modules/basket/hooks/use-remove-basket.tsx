import { guestBasketAtom } from '@/store/guest-basket';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai/react';

export const useRemoveBasketItem = () => {
  const user = useAtomValue(userAtom);
  const [guestBasket, setGuestBasket] = useAtom(guestBasketAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.id) {
        setGuestBasket(guestBasket.filter((i) => i.foodId !== itemId));
        return;
      }
      await axios.delete(`/api/remove-basket?itemId=${itemId}`);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['basket', user.id] });
      }
    },
  });
};
