import { guestBasketAtom } from '@/store/guest-basket';
import { userAtom } from '@/store/user';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';
import { useBasket } from './use-basket';

type Food = {
  id: string;
  name: string;
  compound: string;
  price: number;
  image: string | null;
  category: string;
};

export const useBasketData = () => {
  const user = useAtomValue(userAtom);
  const guestItems = useAtomValue(guestBasketAtom);
  const serverBasket = useBasket();

  const foodQuery = useQuery({
    queryKey: ['food'],
    queryFn: async () => {
      const { data } = await axios.get<Food[]>('/api/get-food');
      return data;
    },
    enabled: !user?.id && guestItems.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  if (user?.id) {
    return {
      data: serverBasket.data,
      isLoading: serverBasket.isLoading,
      isGuest: false as const,
    };
  }

  const items = guestItems
    .map((gi) => {
      const food = foodQuery.data?.find((f) => f.id === gi.foodId);
      if (!food) return null;
      return {
        id: gi.foodId,
        quantity: gi.quantity,
        food,
      };
    })
    .filter(Boolean);

  return {
    data: { items },
    isLoading: guestItems.length > 0 && foodQuery.isLoading,
    isGuest: true as const,
  };
};
