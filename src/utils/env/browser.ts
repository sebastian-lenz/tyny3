import { attr } from '../dom/attr/attr';

export const inBrowser = typeof window !== 'undefined';

export const isRtl =
  inBrowser && attr(document.documentElement, 'dir') === 'rtl';
