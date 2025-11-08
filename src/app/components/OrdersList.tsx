"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { useTranslations } from '../../lib/translations';

interface OrderItem {
  id: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

interface OrdersListProps {
  onOrderClick?: (order: Order) => void;
}

export default function OrdersList({ onOrderClick }: OrdersListProps) {
  const { token, checkAndRefreshToken } = useAuth();
  const { t } = useTranslations();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    if (!token) {
      setError(t('orders.loadError'));
      setLoading(false);
      return;
    }

    try {
      const tokenValid = await checkAndRefreshToken();
      if (!tokenValid) {
        setError(t('orders.loadError'));
        setLoading(false);
        return;
      }

      if (!token) {
        setError(t('orders.loadError'));
        setLoading(false);
        return;
      }

      console.log('Загружаем заказы пользователя...');
      console.log('Токен:', token.substring(0, 20) + '...');

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Ответ сервера:', response.status, response.statusText);
      console.log('Content-Type:', response.headers.get('content-type'));

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Получены заказы:', data);
          setOrders(data.orders || []);
          setError(null);
        } else {
          const text = await response.text();
          console.error('Получен не JSON ответ:', text.substring(0, 200));
          setError(t('orders.loadError'));
        }
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Ошибка при загрузке заказов:', errorData);
          setError(errorData.error || t('orders.loadError'));
        } else {
          const text = await response.text();
          console.error('Получен не JSON ответ при ошибке:', text.substring(0, 200));
          setError(t('orders.loadError'));
        }
      }
    } catch (err) {
      console.error('Ошибка при загрузке заказов:', err);
      setError(t('orders.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (orderId: string) => {
    if (!token) {
      setError(t('orders.loadError'));
      return;
    }

    try {
      const tokenValid = await checkAndRefreshToken();
      if (!tokenValid) {
        setError(t('orders.loadError'));
        return;
      }

      if (!token) {
        setError(t('orders.loadError'));
        return;
      }

      console.log('Подтверждаем доставку заказа:', orderId);

      const response = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Ответ сервера:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Доставка подтверждена:', data);
        
        // Обновляем заказ в списке
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'Delivered', updatedAt: new Date().toISOString() }
              : order
          )
        );
        
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка при подтверждении доставки:', errorData);
        setError(errorData.error || t('orders.loadError'));
      }
    } catch (err) {
      console.error('Ошибка при подтверждении доставки:', err);
      setError(t('orders.loadError'));
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return t('orders.statusPending');
      case 'processing':
        return t('orders.statusProcessing');
      case 'shipped':
        return t('orders.statusShipped');
      case 'delivered':
        return t('orders.statusDelivered');
      case 'cancelled':
        return t('orders.statusCancelled');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{t('orders.loadingOrders')}</h3>
        <p className="text-[var(--muted)]">{t('orders.gettingData')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">{t('orders.loadError')}</h3>
        <p className="text-[var(--muted)] mb-6">{error}</p>
        <button 
          onClick={loadOrders}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('orders.tryAgain')}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{t('orders.noOrders')}</h3>
        <p className="text-[var(--muted)] mb-6">{t('orders.noOrdersDescription')}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('orders.goShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-3">
          <span className="text-2xl">📦</span>
          {t('orders.orderHistory')}
        </h2>
        <button 
          onClick={loadOrders}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
{t('orders.refresh')}
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="card p-6 hover:bg-[var(--card)]/80 transition-colors cursor-pointer"
            onClick={() => onOrderClick?.(order)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {t('orders.orderNumber')} #{order.id.slice(-8)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="text-sm text-[var(--muted)] mb-3">
                  {t('orders.created')}: {formatDate(order.createdAt)}
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-[var(--muted)]">{t('orders.itemsCount')}: </span>
                    <span className="text-[var(--foreground)] font-medium">{order.items.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-[var(--muted)]">{t('orders.amount')}: </span>
                    <span className="text-[var(--foreground)] font-medium text-lg">
                      {order.totalAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:items-end gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {order.totalAmount.toFixed(2)} €
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors">
                    {t('orders.moreDetails')}
                  </button>
                  {(order.status === 'Shipped' || order.status === 'Pending') && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelivery(order.id);
                      }}
                      className="px-3 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
{t('orders.confirmDelivery')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Детали заказа (показываются при клике) */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[var(--foreground)]">{t('orders.orderItems')}:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-[var(--foreground)]">{item.bookTitle}</span>
                      <span className="text-[var(--muted)] ml-2">x{item.quantity}</span>
                    </div>
                    <div className="text-[var(--foreground)] font-medium">
                      {Number(item.totalPrice).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
