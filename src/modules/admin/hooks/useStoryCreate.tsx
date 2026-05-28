'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useStoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-story'],
    mutationFn: async (data: { title: string; image: FileList }) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('image', data.image[0]);
      const { data: response } = await axios.post('/api/create-story', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
};
