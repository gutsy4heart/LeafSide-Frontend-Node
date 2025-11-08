"use client";

import React, { createContext, useContext, useState, useEffect, startTransition } from 'react';

type Language = 'ru' | 'en' | 'pl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with default 'ru' to match server and client initial render
  // This prevents hydration mismatches
  const [language, setLanguageState] = useState<Language>('ru');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted - this happens after hydration
    setIsMounted(true);
    
    // Use setTimeout to ensure we're well past React's hydration phase
    // Even with suppressHydrationWarning, we want to avoid any state updates
    // during the hydration reconciliation phase
    const timeoutId = setTimeout(() => {
      // Now safely read from localStorage and update language
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en' || savedLanguage === 'pl')) {
          // Use startTransition to mark this as a non-urgent update
          // This ensures it doesn't interfere with hydration
          startTransition(() => {
            setLanguageState(savedLanguage);
          });
        }
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Reload the page to apply language changes
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
