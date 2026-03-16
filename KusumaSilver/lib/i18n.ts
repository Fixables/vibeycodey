import { id } from './translations/id';
import { en } from './translations/en';

export type Locale = 'id' | 'en';
export const SUPPORTED_LOCALES: Locale[] = ['id', 'en'];
export const DEFAULT_LOCALE: Locale = 'id';

const dicts = { id, en } as const;

export function getT(locale: Locale) {
  return dicts[locale];
}

export type Translation = typeof id;
