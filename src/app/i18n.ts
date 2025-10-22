import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
 
// Validate that the incoming `locale` parameter is valid
const locales = ['en', 'mn'];
 
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound();
 
  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Ulaanbaatar'
  };
});