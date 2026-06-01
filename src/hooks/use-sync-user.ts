'use client';

import { userAtom } from '@/store/user';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom } from 'jotai/react';
import { useEffect } from 'react';

type FreshUser = {
  id: string;
  email: string;
  city?: string | null;
  street?: string | null;
  home?: string | null;
  apartment?: string | null;
  numbering?: string | null;
  bonuses: number;
};

export const useSyncUser = (options?: { refetchInterval?: number }) => {
  const [user, setUser] = useAtom(userAtom);
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get<FreshUser>(`/api/user?userId=${userId}`);
      return data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: options?.refetchInterval,
  });

  useEffect(() => {
    if (!query.data) return;
    setUser((prev: typeof user) => {
      if (!prev || prev.id !== query.data.id) return prev;
      return { ...prev, ...query.data };
    });
  }, [query.data, setUser]);

  const bonuses = query.data?.bonuses ?? user?.bonuses ?? 0;

  return { user, bonuses, isRefreshing: query.isFetching };
};
