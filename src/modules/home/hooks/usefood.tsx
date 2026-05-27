import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type BackendResault = {
  id: string;
  category: string;
  name: string;
  compound: string;
  price: number;
  image: string;
};

export const useFood = () => {
  return useQuery({
    queryKey: ['food'],
    queryFn: async () => {
      const { data } = await axios.get<BackendResault[]>('/api/get-food');
      console.log(data, 'данные каталогов еды');

      return data;
    },
  });
};
