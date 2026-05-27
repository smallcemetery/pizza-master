/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/user.ts
import { atomWithStorage } from 'jotai/utils';

// Тип юзера (можешь вынести в интерфейс)
export const userAtom = atomWithStorage<any>('user_data', null);
