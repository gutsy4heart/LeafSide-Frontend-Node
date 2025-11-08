"use client";

import Link from "next/link";
import { useTranslations } from "../../../lib/translations";

export default function NotFound() {
  const { t } = useTranslations();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[var(--foreground)]">📚</h1>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            {t('book.notFound')}
          </h2>
          <p className="text-[var(--muted)] max-w-md mx-auto">
            {t('book.descriptionNotAvailable')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="btn-accent inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
{t('book.backToCatalog')}
          </Link>
          
          <Link 
            href="/" 
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors py-2"
          >
{t('home.viewCatalog')}
          </Link>
        </div>
      </div>
    </div>
  );
}