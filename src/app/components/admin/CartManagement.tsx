"use client";

import { AdminCart } from "../../../types/cart";
import { useTranslations } from "../../../lib/translations";

interface CartManagementProps {
  carts: AdminCart[];
}

export default function CartManagement({ carts }: CartManagementProps) {
  const { t } = useTranslations();
  
  return (
    <>
      {/* Информация о корзинах */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--muted)] mb-2">
              {t('admin.cartManagement.userCarts')}
            </label>
            <div className="text-sm text-[var(--muted)]">
              {t('admin.cartManagement.viewAllActiveCarts')}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-[var(--muted)]">
          {t('admin.cartManagement.totalCarts', { count: carts.length })}
        </div>
      </div>

      {/* Таблица корзин */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[var(--card)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.cartManagement.cartId')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.cartManagement.userEmail')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.cartManagement.itemsCount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  {t('admin.cartManagement.status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card)] divide-y divide-white/10">
              {carts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-[var(--muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <p className="text-lg font-medium text-[var(--foreground)] mb-2">{t('admin.cartManagement.noCartsFound')}</p>
                      <p className="text-[var(--muted)]">
                        {t('admin.cartManagement.cartsWillAppearHere')}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      #{cart.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {cart.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {cart.items.length} {t('admin.cartManagement.items')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cart.items.length > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cart.items.length > 0 ? t('admin.cartManagement.active') : t('admin.cartManagement.empty')}
                      </span>
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
