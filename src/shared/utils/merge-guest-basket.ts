import type { GuestBasketItem } from '@/store/guest-basket';
import axios from 'axios';

export async function mergeGuestBasketToServer(userId: string, items: GuestBasketItem[]) {
  for (const { foodId, quantity } of items) {
    await axios.post('/api/add-basket', { userId, foodId, quantity });
  }
}
