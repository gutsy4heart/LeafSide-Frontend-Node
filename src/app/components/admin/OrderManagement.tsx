"use client";

import { Order, OrderStatus, ORDER_STATUSES } from "../../../types/order";
import { useTranslations } from "../../../lib/translations";

interface OrderManagementProps {
  orders: Order[];
  filteredOrders: Order[];
  orderSearchTerm: string;
  setOrderSearchTerm: (term: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (filter: string) => void;
  updatingOrderStatus: string | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export default function OrderManagement({
  orders,
  filteredOrders,
  orderSearchTerm,
  setOrderSearchTerm,
  orderStatusFilter,
  setOrderStatusFilter,
  updatingOrderStatus,
  updateOrderStatus
}: OrderManagementProps) {
  const { t } = useTranslations();
  
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return t('admin.orderManagement.statusPending');
      case 'processing':
        return t('admin.orderManagement.statusProcessing');
      case 'shipped':
        return t('admin.orderManagement.statusShipped');
      case 'delivered':
        return t('admin.orderManagement.statusDelivered');
      case 'cancelled':
        return t('admin.orderManagement.statusCancelled');
      default:
        return status;
    }
  };
  
  return (
    <>
      {/* Поиск и фильтрация */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--muted)] mb-2">
              {t('admin.orderManagement.searchOrders')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('admin.orderManagement.searchPlaceholder')}
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-[var(--card)] text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-[var(--muted)] mb-2">
              {t('admin.orderManagement.filterByStatus')}
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-white/10 rounded-md leading-5 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('admin.orderManagement.allStatuses')}</option>
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-[var(--muted)]">
          {t('admin.orderManagement.showingResults', { filtered: filteredOrders.length, total: orders.length })}
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[var(--card)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.orderId')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.client')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.items')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.orderManagement.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card)] divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-2">{t('admin.orderManagement.noOrdersFound')}</p>
                      <p className="text-gray-500">
                        {orderSearchTerm || orderStatusFilter !== 'all'
                          ? t('admin.userManagement.tryDifferentSearch')
                          : t('admin.orderManagement.ordersWillAppearHere')
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      #{order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-[var(--muted)]">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {order.items.length} {t('admin.orderManagement.items')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {order.totalAmount.toLocaleString('ru-RU')} €
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updatingOrderStatus === order.id}
                        className="text-sm border border-white/10 rounded px-2 py-1 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>{getStatusText(status)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
