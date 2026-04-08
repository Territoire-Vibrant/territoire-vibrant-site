export const LOCALE_CURRENCY: Record<string, string> = {
  en: 'CAD',
  fr: 'CAD',
  pt: 'BRL',
  es: 'USD',
}

/** Fixed retail prices per currency. */
export const PRICES_BY_CURRENCY: Record<string, number> = {
  CAD: 6.43,
  BRL: 24.9,
  USD: 4.69,
}

export function getPriceByCurrency(currency: string): number {
  return PRICES_BY_CURRENCY[currency] ?? PRICES_BY_CURRENCY.CAD ?? 6.43
}
