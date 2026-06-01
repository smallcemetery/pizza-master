'use client';

import { profileAvatarAtom } from '@/store/profile-avatar';
import { userAtom } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom } from 'jotai/react';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);
  const setAvatar = useSetAtom(profileAvatarAtom);

  return useMutation({
    mutationFn: async () => {
      await axios.post('/api/logout');
    },
    onSuccess: () => {
      setUser(null);
      setAvatar(null);
      queryClient.clear();
      router.push('/authorization');
      router.refresh();
    },
  });
};
