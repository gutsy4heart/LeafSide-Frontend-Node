"use client";

import { useLanguage } from '../language-context';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2" suppressHydrationWarning>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'ru' 
            ? 'bg-blue-600 text-white' 
            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pl')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'pl' 
            ? 'bg-blue-600 text-white' 
            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }`}
      >
        PL
      </button>
    </div>
  );
}
