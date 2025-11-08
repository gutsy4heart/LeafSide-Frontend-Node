import { useLanguage } from '../app/language-context';
import ruMessages from '../messages/ru.json';
import enMessages from '../messages/en.json';
import plMessages from '../messages/pl.json';

const messages = {
  ru: ruMessages,
  en: enMessages,
  pl: plMessages,
};

// Helper function to get the correct plural form for Russian
function getRussianPluralForm(count: number, forms: { one?: string; few?: string; many?: string; other?: string }): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return forms.one || forms.other || '';
  }
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return forms.few || forms.other || '';
  }
  return forms.many || forms.other || '';
}

// Helper function to get the correct plural form for Polish
function getPolishPluralForm(count: number, forms: { one?: string; few?: string; many?: string; other?: string }): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (count === 1) {
    return forms.one || forms.other || '';
  }
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return forms.few || forms.other || '';
  }
  return forms.many || forms.other || '';
}

// Helper function to get the correct plural form for English
function getEnglishPluralForm(count: number, forms: { one?: string; other?: string }): string {
  if (count === 1) {
    return forms.one || forms.other || '';
  }
  return forms.other || forms.one || '';
}

export function useTranslations() {
  const { language } = useLanguage();
  
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = messages[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      console.log('Available keys:', Object.keys(messages[language] || {}));
      console.log('Trying to access:', keys);
      return key;
    }
    
    let translated = value;
    
    // First, replace simple parameters like {amount}
    if (params) {
      for (const paramKey in params) {
        translated = translated.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]));
      }
    }
    
    // Then, handle pluralization patterns like {count, plural, one {form1} few {form2} ...}
    const pluralPatternRegex = /\{(\w+),\s*plural,\s*(.+?)\}/g;
    let match;
    
    while ((match = pluralPatternRegex.exec(translated)) !== null) {
      const variableName = match[1]; // e.g., 'count'
      const formsString = match[2]; // e.g., 'one {товар} few {товара} many {товаров} other {товаров}'
      
      const count = params && params[variableName] !== undefined ? Number(params[variableName]) : 0;
      
      const forms: { [k: string]: string } = {};
      const formParts = formsString.matchAll(/(\w+)\s*\{([^}]+)\}/g);
      for (const part of formParts) {
        forms[part[1]] = part[2];
      }
      
      let selectedForm = forms.other || ''; // Default fallback
      
      if (language === 'ru') {
        selectedForm = getRussianPluralForm(count, forms);
      } else if (language === 'pl') {
        selectedForm = getPolishPluralForm(count, forms);
      } else if (language === 'en') {
        selectedForm = getEnglishPluralForm(count, forms);
      }
      
      // Replace the entire pluralization pattern with the selected form
      translated = translated.replace(match[0], selectedForm);
    }
    
    return translated;
  };
  
  return { t, language };
}
