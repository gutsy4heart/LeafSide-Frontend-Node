"use client";

import { useCart } from "../cart-context";
import { useAuth } from "../auth-context";
import { useTranslations } from "../../lib/translations";
import { useEffect, useState } from "react";
import { Book } from "../../types/book";
import { fetchJson } from "../../lib/api";
import Link from "next/link";
import OrderConfirmationModal from "../components/OrderConfirmationModal";

export default function CartPage() {
  const { state, add, remove, clear, count, loading: cartLoading, error: cartError } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslations();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Загружаем данные книг для отображения в корзине
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем все книги
        const allBooks = await fetchJson<Book[]>("/api/books");
        
        // Фильтруем только те книги, которые есть в корзине
        const cartBookIds = state.items.map(item => item.bookId);
        const cartBooks = allBooks.filter(book => cartBookIds.includes(book.id));
        
        setBooks(cartBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('cart.error'));
      } finally {
        setLoading(false);
      }
    };

    if (state.items.length > 0) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [state.items]);

  const updateQuantity = async (bookId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await remove(bookId);
    } else {
      // Добавляем с новым количеством (API автоматически обновит существующий элемент)
      await add(bookId, newQuantity);
    }
  };

  const getBookById = (bookId: string) => {
    return books.find(book => book.id === bookId);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const book = getBookById(item.bookId);
      return total + (book ? Number(book.price) * item.quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>{t('cart.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('cart.error')}</h2>
          <p className="text-gray-600 mb-4">{error || cartError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('cart.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 16a2 2 0 104 0 2 2 0 00-4 0m8 0a2 2 0 104 0 2 2 0 00-4 0" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{t('cart.emptyTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('cart.emptyDescription')}</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t('cart.goToCatalog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">{t('cart.title')}</h1>
            <p className="text-[var(--muted)] mt-1">
              {t('cart.itemsSummary', { count: getTotalItems(), amount: getTotalPrice().toFixed(2) })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--accent)]">
                €{getTotalPrice().toFixed(2)}
              </div>
              <div className="text-sm text-[var(--muted)]">
                {getTotalItems()} {t('cart.items')}
              </div>
            </div>
            <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 16a2 2 0 104 0 2 2 0 00-4 0m8 0a2 2 0 104 0 2 2 0 00-4 0" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {state.items.map((item) => {
                const book = getBookById(item.bookId);
                if (!book) return null;

                return (
                  <div key={item.bookId} className="bg-[var(--card)] border border-white/10 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {/* Обложка книги */}
                      <div className="w-20 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {book.imageUrl ? (
                          <img 
                            src={book.imageUrl} 
                            alt={book.title} 
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span>{book.title.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Информация о книге */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1 truncate">
                          {book.title}
                        </h3>
                        <p className="text-[var(--muted)] mb-2">{t('cart.author')}: {book.author}</p>
                        <p className="text-[var(--muted)] text-sm mb-3">
                          {book.publishedYear} • {book.pageCount} {t('cart.pages')} • {book.language}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[var(--accent)]">
                            €{Number(book.price).toFixed(2)}
                          </span>
                          <span className="text-sm text-[var(--muted)]">
                            {t('cart.perItem')}
                          </span>
                        </div>
                      </div>

                      {/* Управление количеством */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                            disabled={cartLoading || item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-[var(--card)] border border-white/20 flex items-center justify-center hover:bg-[var(--accent)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                            disabled={cartLoading}
                            className="w-8 h-8 rounded-full bg-[var(--card)] border border-white/20 flex items-center justify-center hover:bg-[var(--accent)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => remove(item.bookId)}
                          disabled={cartLoading}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
{t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Кнопка очистки корзины */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => clear()}
                disabled={cartLoading}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
{t('cart.clearCart')}
              </button>
            </div>
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card)] border border-white/10 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">{t('cart.total')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{t('cart.totalItems')} ({getTotalItems()})</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{t('cart.shipping')}</span>
                  <span className="text-green-500">{t('cart.free')}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('cart.totalAmount')}</span>
                    <span className="text-[var(--accent)]">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <button 
                  onClick={() => setShowOrderModal(true)}
                  className="w-full bg-[var(--accent)] text-white py-3 px-4 rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium"
                >
{t('cart.checkout')}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--muted)] text-center">
                    {t('cart.loginToOrder')}
                  </p>
                  <Link 
                    href="/login"
                    className="w-full bg-[var(--accent)] text-white py-3 px-4 rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium text-center block"
                  >
{t('cart.login')}
                  </Link>
                </div>
              )}

              <div className="mt-4 text-xs text-[var(--muted)] text-center">
                <p>{t('cart.securePayment')}</p>
                <p>{t('cart.fastDelivery')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения заказа */}
      <OrderConfirmationModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSuccess={() => {
          // Можно добавить дополнительную логику после успешного оформления
          console.log('Заказ успешно оформлен!');
        }}
        totalAmount={getTotalPrice()}
        totalItems={getTotalItems()}
      />
    </div>
  );
}
