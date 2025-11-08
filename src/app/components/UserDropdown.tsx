"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth-context";
import { useTranslations } from "../../lib/translations";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { logout, userInfo, isAdmin } = useAuth();
  const { t } = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const handleAdmin = () => {
    setIsOpen(false);
    router.push("/admin");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {userInfo?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden sm:block">{userInfo?.email || t('common.user')}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-white/10 rounded-md shadow-lg z-50">
          <div className="py-1">
            {/* Информация о пользователе */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium text-[var(--foreground)]">{userInfo?.email || t('common.user')}</p>
              <p className="text-xs text-[var(--muted)]">{t('common.accountActive')}</p>
            </div>

            {/* Опции меню */}
            <button
              onClick={handleProfile}
              className="w-full px-4 py-3 text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('navigation.profile')}
            </button>

            {isAdmin && (
              <button
                onClick={handleAdmin}
                className="w-full px-4 py-3 text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('navigation.admin')}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('navigation.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
