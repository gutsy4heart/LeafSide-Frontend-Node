"use client";

import { useTranslations } from "../../../lib/translations";

interface ActionButtonsProps {
  activeTab: 'users' | 'books' | 'orders' | 'carts';
  loading: boolean;
  booksLoading: boolean;
  ordersLoading: boolean;
  cartsLoading: boolean;
  onRefresh: () => void;
  onAddUser: () => void;
  onAddBook: () => void;
  onCheckBackend: () => void;
}

export default function ActionButtons({
  activeTab,
  loading,
  booksLoading,
  ordersLoading,
  cartsLoading,
  onRefresh,
  onAddUser,
  onAddBook,
  onCheckBackend
}: ActionButtonsProps) {
  const { t } = useTranslations();
  const isLoading = loading || booksLoading || ordersLoading || cartsLoading;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {/* Mobile: Stack buttons vertically, Desktop: horizontal */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={onCheckBackend}
          className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">{t('admin.checkBackend')}</span>
          <span className="sm:hidden">{t('admin.backend')}</span>
        </button>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 sm:px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? t('common.loading') : t('common.refresh')}
        </button>
      </div>
      
      {/* Add buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {activeTab === 'users' && (
          <button
            onClick={onAddUser}
            className="px-3 sm:px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">{t('admin.addUser')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </button>
        )}
        
        {activeTab === 'books' && (
          <button
            onClick={onAddBook}
            className="px-3 sm:px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">{t('admin.addBook')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
