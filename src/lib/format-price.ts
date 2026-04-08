/**
 * Maps the site's 4 locale codes to their corresponding BCP 47 tags
 * used by Intl.NumberFormat for currency formatting.
 *
 * Examples with CAD $12.50:
 *  en → en-CA → CA$12.50
 *  fr → fr-CA → 12,50 $CA
 *  pt → pt-BR → CA$ 12,50
 *  es → es-ES → 12,50 CA$
 */
const LOCALE_BCP47: Record<string, string> = {
  en: 'en-CA',
  fr: 'fr-CA',
  pt: 'pt-BR',
  es: 'es-ES',
}

export function formatPrice(price: number, locale: string, currency: string): string {
  const bcp47 = LOCALE_BCP47[locale] ?? 'en-CA'
  return new Intl.NumberFormat(bcp47, {
    style: 'currency',
    currency,
  }).format(price)
}
