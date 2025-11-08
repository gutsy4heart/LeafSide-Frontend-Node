"use client";

import { useTranslations } from "../../lib/translations";

export default function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="mt-8 border-t border-white/10" suppressHydrationWarning>
      <div className="container py-6 text-sm text-[var(--muted)] flex items-center justify-between" suppressHydrationWarning>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <div className="flex items-center gap-4" suppressHydrationWarning>
          <a href="#" className="hover:text-[var(--foreground)]">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-[var(--foreground)]">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
}
