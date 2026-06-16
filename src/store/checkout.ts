import { atomWithStorage } from 'jotai/utils';

export type CheckoutDraft = {
  deliveryType: 'courier' | 'pickup';
  deliveryTime: string;
  paymentMethod: 'card' | 'cash' | 'bonus';
  bonusUsed: number;
  address: string;
  subtotal: number;
  total: number;
};

export const checkoutDraftAtom = atomWithStorage<CheckoutDraft | null>('checkout_draft', null);
