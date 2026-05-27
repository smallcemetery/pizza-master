import { userAtom } from '@/store/user';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';

export const useBasket = () => {
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  return useQuery({
    queryKey: ['basket', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/get-basket?userId=${userId}`);
      return data;
    },
    // ВАЖНО: запрос не выполнится, пока userId не появится в Jotai
    enabled: !!userId,

    // Опционально: корзина будет считаться "протухшей" через 1 минуту
    staleTime: 1000 * 60,
  });
};
