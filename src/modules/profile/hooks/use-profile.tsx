import { userAtom } from '@/store/user';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai/react';

export const useOrders = () => {
  const user = useAtomValue(userAtom);
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/orders?userId=${user?.id}`);
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useActions = () => {
  return useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/actions');
      return data;
    },
  });
};
