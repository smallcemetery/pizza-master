import { atomWithStorage } from 'jotai/utils';

/** Аватар профиля (base64), хранится локально в браузере */
export const profileAvatarAtom = atomWithStorage<string | null>('profile_avatar', null);
