"use client";

import { useTranslations } from "../../../lib/translations";

interface Stats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
}

interface StatsProps {
  activeTab: 'users' | 'books' | 'orders' | 'carts';
  stats: Stats;
  booksCount: number;
  ordersCount: number;
  cartsCount: number;
}

export default function Stats({ activeTab, stats, booksCount, ordersCount, cartsCount }: StatsProps) {
  const { t } = useTranslations();
  if (activeTab === 'users') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">{t('admin.stats.totalUsers')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">{t('admin.stats.regularUsers')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.regularUsers}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">{t('admin.stats.adminUsers')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.adminUsers}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm font-medium">{t('admin.stats.recentUsers')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.recentUsers}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'books') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">{t('admin.stats.totalBooks')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{booksCount}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'orders') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">{t('admin.stats.totalOrders')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{ordersCount}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'carts') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">{t('admin.stats.activeCarts')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{cartsCount}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
