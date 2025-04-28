// src/atoms/chatBlurAtom.ts
import {atom} from 'jotai';

export const isBlurModeAtom = atom(false);
export const selectedBubbleIdAtom = atom<number | null>(null);

export const isOpenEditAtom = atom<boolean>(false);

export const isOpenAddContentAtom = atom<boolean>(false);
