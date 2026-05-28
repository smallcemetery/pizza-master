import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';

export const useRemoveBasketItem = () => {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await axios.delete(`/api/remove-basket?itemId=${itemId}`);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['basket', user.id] });
      }
    },
  });
};
