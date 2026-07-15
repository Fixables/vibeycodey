import { id } from './translations/id';
import { en } from './translations/en';

export type Locale = 'id' | 'en';
export const SUPPORTED_LOCALES: Locale[] = ['id', 'en'];
export const DEFAULT_LOCALE: Locale = 'id';

const dicts = { id, en } as const;

export function getT(locale: Locale) {
  return dicts[locale];
}

// Widen literal string types (from the `as const` dicts) to `string` so a
// `Translation`-typed parameter accepts either locale's dictionary — the two
// dicts share shape but not literal values.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Translation = Widen<typeof id>;
