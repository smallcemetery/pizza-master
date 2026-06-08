import { atomWithStorage } from 'jotai/utils';

export type GuestBasketItem = {
  foodId: string;
  quantity: number;
};

export const guestBasketAtom = atomWithStorage<GuestBasketItem[]>('guest_basket', []);
