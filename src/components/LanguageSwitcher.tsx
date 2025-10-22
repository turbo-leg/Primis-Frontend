'use client';

import { useLocale } from 'next-intl';
import { usePathname as useNextPathname } from 'next/navigation';
import { Link } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = useNextPathname();
  
  // Remove locale prefix from pathname to get the base path
  const pathWithoutLocale = pathname.replace(/^\/(en|mn)/, '') || '/';

  return (
    <div className="flex items-center">
      <Link
        href={pathWithoutLocale}
        locale="en"
        className={`
          w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
          ${locale === 'en' 
            ? 'bg-white text-primis-navy shadow-sm' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
        title="English"
      >
        EN
      </Link>
      <Link
        href={pathWithoutLocale}
        locale="mn"
        className={`
          w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
          ${locale === 'mn' 
            ? 'bg-white text-primis-navy shadow-sm' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
        title="Монгол"
      >
        MN
      </Link>
    </div>
  );
}
