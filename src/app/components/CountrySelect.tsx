"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "../../lib/translations";

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

// Simplified country list with only essential countries
const countries: Country[] = [
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", phoneCode: "+7" },
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
  { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
  { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", phoneCode: "+82" },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", phoneCode: "+90" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", phoneCode: "+380" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", phoneCode: "+375" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", phoneCode: "+998" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", phoneCode: "+996" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", phoneCode: "+992" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", phoneCode: "+993" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", phoneCode: "+994" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", phoneCode: "+374" },
  { code: "GE", name: "Georgia", flag: "🇬🇪", phoneCode: "+995" },
  { code: "MD", name: "Moldova", flag: "🇲🇩", phoneCode: "+373" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", phoneCode: "+370" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", phoneCode: "+371" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", phoneCode: "+372" },
  { code: "PL", name: "Poland", flag: "🇵🇱", phoneCode: "+48" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", phoneCode: "+420" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", phoneCode: "+421" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", phoneCode: "+36" },
  { code: "RO", name: "Romania", flag: "🇷🇴", phoneCode: "+40" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", phoneCode: "+359" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", phoneCode: "+385" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", phoneCode: "+386" },
  { code: "AT", name: "Austria", flag: "🇦🇹", phoneCode: "+43" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", phoneCode: "+41" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", phoneCode: "+31" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", phoneCode: "+32" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", phoneCode: "+46" },
  { code: "NO", name: "Norway", flag: "🇳🇴", phoneCode: "+47" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", phoneCode: "+45" },
  { code: "FI", name: "Finland", flag: "🇫🇮", phoneCode: "+358" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", phoneCode: "+353" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "+351" },
  { code: "GR", name: "Greece", flag: "🇬🇷", phoneCode: "+30" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", phoneCode: "+357" },
  { code: "MT", name: "Malta", flag: "🇲🇹", phoneCode: "+356" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", phoneCode: "+352" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", phoneCode: "+354" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", phoneCode: "+423" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", phoneCode: "+377" },
  { code: "SM", name: "San Marino", flag: "🇸🇲", phoneCode: "+378" },
  { code: "VA", name: "Vatican", flag: "🇻🇦", phoneCode: "+379" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", phoneCode: "+376" }
];

interface CountrySelectProps {
  value: string;
  onChange: (countryCode: string, phoneCode: string) => void;
  disabled?: boolean;
}

export default function CountrySelect({ value, onChange, disabled = false }: CountrySelectProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCountryName = (countryCode: string) => {
    return t(`countrySelect.countries.${countryCode}`) || countries.find(c => c.code === countryCode)?.name || countryCode;
  };

  const selectedCountry = countries.find(country => country.code === value) || countries[0];

  const filteredCountries = countries.filter(country => {
    const translatedName = getCountryName(country.code);
    return translatedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           country.phoneCode.includes(searchTerm);
  });

  console.log('CountrySelect - Total countries:', countries.length);
  console.log('CountrySelect - Filtered countries:', filteredCountries.length);
  console.log('CountrySelect - Search term:', searchTerm);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: Country) => {
    onChange(country.code, country.phoneCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full h-10 flex items-center justify-between px-3 py-2 bg-[var(--card)] border border-white/20 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base">{selectedCountry.flag}</span>
          <span className="text-xs text-[var(--foreground)] truncate">{getCountryName(selectedCountry.code)}</span>
          <span className="text-xs text-[var(--muted)]">({selectedCountry.phoneCode})</span>
        </div>
        <svg 
          className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--card)] border border-white/20 rounded-lg shadow-xl max-h-60 overflow-hidden backdrop-blur-sm">
          <div className="p-3 border-b border-white/10">
            <input
              type="text"
              placeholder={t('countrySelect.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 px-3 py-2 bg-[var(--card)] border border-white/20 rounded-md text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country, index) => (
              <button
                key={`${country.code}-${index}`}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className="w-full px-3 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group"
              >
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-blue-400 transition-colors">{getCountryName(country.code)}</div>
                  <div className="text-xs text-[var(--muted)]">{country.phoneCode}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
