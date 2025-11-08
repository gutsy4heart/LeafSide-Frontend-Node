"use client";

import { useTranslations } from "../../../lib/translations";

interface TabNavigationProps {
  activeTab: 'users' | 'books' | 'orders' | 'carts';
  setActiveTab: (tab: 'users' | 'books' | 'orders' | 'carts') => void;
  usersCount: number;
  booksCount: number;
  ordersCount: number;
  cartsCount: number;
}

export default function TabNavigation({ 
  activeTab, 
  setActiveTab, 
  usersCount, 
  booksCount, 
  ordersCount, 
  cartsCount 
}: TabNavigationProps) {
  const { t } = useTranslations();
  
  const tabs = [
    {
      id: 'users' as const,
      label: t('admin.users'),
      count: usersCount,
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'books' as const,
      label: t('admin.books'),
      count: booksCount,
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'orders' as const,
      label: t('admin.orders'),
      count: ordersCount,
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'carts' as const,
      label: t('admin.carts'),
      count: cartsCount,
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-white/10">
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span className="whitespace-nowrap">
                  {tab.label} ({tab.count})
                </span>
              </div>
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full bg-[var(--card)] border border-white/20 rounded-lg px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label} ({tab.count})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
