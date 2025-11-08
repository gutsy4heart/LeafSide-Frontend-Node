"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { useCart } from "../cart-context";
import { useTranslations } from "../../lib/translations";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  totalAmount: number;
  totalItems: number;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  onSuccess,
  totalAmount,
  totalItems
}: OrderConfirmationModalProps) {
  const { token, checkAndRefreshToken, userInfo } = useAuth();
  const { state, clear } = useCart();
  const { t, language } = useTranslations();
  
  // Отладка переводов
  useEffect(() => {
    if (isOpen) {
      console.log('Current language:', language);
      console.log('deliveryInfo:', t('orderConfirmation.deliveryInfo'));
      console.log('customerName:', t('orderConfirmation.customerName'));
      console.log('customerPhone:', t('orderConfirmation.customerPhone'));
      console.log('shippingAddress:', t('orderConfirmation.shippingAddress'));
      console.log('notes:', t('orderConfirmation.notes'));
    }
  }, [isOpen, language, t]);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Форма с данными заказа
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Автозаполнение данных из профиля при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setError(null);
      setValidationErrors({});
      
      // Автозаполнение из профиля пользователя
      if (userInfo) {
        const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
        setCustomerName(fullName || userInfo.name || '');
        setCustomerEmail(userInfo.email || '');
        setCustomerPhone(userInfo.phoneNumber || '');
      }
    }
  }, [isOpen, userInfo]);
  
  // Функция валидации формы
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!shippingAddress.trim()) {
      errors.shippingAddress = t('orderConfirmation.shippingAddressRequired');
    } else if (shippingAddress.trim().length < 10) {
      errors.shippingAddress = t('orderConfirmation.shippingAddressTooShort');
    }
    
    if (!customerName.trim()) {
      errors.customerName = t('orderConfirmation.customerNameRequired');
    }
    
    if (!customerEmail.trim()) {
      errors.customerEmail = t('orderConfirmation.customerEmailRequired');
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      errors.customerEmail = t('orderConfirmation.invalidEmail');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!token) {
      setError(t('orderConfirmation.loginRequired'));
      return;
    }
    
    // Валидация формы
    if (!validateForm()) {
      setError(t('orderConfirmation.fillRequiredFields'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStep('processing');

      // Проверяем и обновляем токен при необходимости
      const tokenValid = await checkAndRefreshToken();
      if (!tokenValid) {
        setError(t('orderConfirmation.sessionExpired'));
        setStep('confirm');
        return;
      }

      // Получаем актуальный токен
      const currentToken = token;

      // Подготавливаем данные заказа со ВСЕМИ обязательными полями
      const orderData = {
        items: state.items.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        shippingAddress: shippingAddress.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined
      };

      // Отправляем запрос на создание заказа
      console.log('Отправляем данные заказа:', orderData);
      console.log('Токен:', currentToken.substring(0, 20) + '...');
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      console.log('Ответ сервера:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Заказ успешно создан:', result);
        
        // Очищаем корзину
        clear();
        setStep('success');
        
        // Автоматически закрываем модальное окно через 3 секунды
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка при создании заказа:', errorData);
        setError(errorData.error || t('orderConfirmation.orderErrorDetails'));
        setStep('confirm');
      }
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      setError(t('orderConfirmation.orderError'));
      setStep('confirm');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-enter">
      <div className="bg-[var(--card)] border border-white/10 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            {t('orderConfirmation.title')}
          </h3>
          {step === 'confirm' && (
            <button
              onClick={onClose}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Содержимое в зависимости от шага */}
        {step === 'confirm' && (
          <div className="space-y-6">
            {/* Информация о заказе */}
            <div className="bg-[var(--background)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--foreground)] mb-3">{t('orderConfirmation.orderDetails')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">{t('orderConfirmation.items')}:</span>
                  <span className="text-[var(--foreground)]">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">{t('orderConfirmation.amount')}:</span>
                  <span className="text-[var(--foreground)] font-medium">€{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">{t('orderConfirmation.shipping')}:</span>
                  <span className="text-green-400">{t('orderConfirmation.free')}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
                  <span className="text-[var(--foreground)]">{t('orderConfirmation.total')}:</span>
                  <span className="text-[var(--accent)]">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Форма с данными доставки */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('orderConfirmation.deliveryInfo')}
              </h4>

              {/* Имя получателя */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('orderConfirmation.customerName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('orderConfirmation.customerNamePlaceholder')}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-[var(--card)] border ${
                    validationErrors.customerName ? 'border-red-500' : 'border-white/20'
                  } text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all`}
                  disabled={loading}
                />
                {validationErrors.customerName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.customerName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder={t('orderConfirmation.customerEmailPlaceholder')}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-[var(--card)] border ${
                    validationErrors.customerEmail ? 'border-red-500' : 'border-white/20'
                  } text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all`}
                  disabled={loading}
                />
                {validationErrors.customerEmail && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.customerEmail}
                  </p>
                )}
              </div>

              {/* Телефон */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('orderConfirmation.customerPhone')}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t('orderConfirmation.customerPhonePlaceholder')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--card)] border border-white/20 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              {/* Адрес доставки */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('orderConfirmation.shippingAddress')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder={t('orderConfirmation.shippingAddressPlaceholder')}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-[var(--card)] border ${
                    validationErrors.shippingAddress ? 'border-red-500' : 'border-white/20'
                  } text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all resize-none`}
                  disabled={loading}
                />
                {validationErrors.shippingAddress && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.shippingAddress}
                  </p>
                )}
              </div>

              {/* Примечания */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('orderConfirmation.notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('orderConfirmation.notesPlaceholder')}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--card)] border border-white/20 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ошибка */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-[var(--muted)] bg-[var(--card)] border border-white/20 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors"
              >
{t('orderConfirmation.cancel')}
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] bg-[var(--accent)] border border-transparent rounded-lg hover:bg-[var(--accent)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 transition-colors"
              >
{loading ? t('orderConfirmation.processing') : t('orderConfirmation.confirm')}
              </button>
            </div>
          </div>
        )}

        {/* Шаг обработки */}
        {step === 'processing' && (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full"></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-[var(--foreground)] mb-2">
                {t('orderConfirmation.processingTitle')}
              </h4>
              <p className="text-[var(--muted)] text-sm">
                {t('orderConfirmation.processingDescription')}
              </p>
            </div>
          </div>
        )}

        {/* Шаг успешного оформления */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="relative success-animation">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Анимация успеха */}
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-green-500/30 rounded-full animate-ping"></div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-[var(--foreground)] mb-2">
                {t('orderConfirmation.successTitle')}
              </h4>
              <p className="text-[var(--muted)] text-sm mb-4">
                {t('orderConfirmation.successDescription', { amount: totalAmount.toFixed(2) })}
              </p>
              <p className="text-[var(--muted)] text-xs">
                {t('orderConfirmation.autoClose')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
