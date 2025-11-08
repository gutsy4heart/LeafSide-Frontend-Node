"use client";

import { UserWithRole, UserRole } from "../../../types/user";
import { useTranslations } from "../../../lib/translations";

interface UserManagementProps {
  users: UserWithRole[];
  filteredUsers: UserWithRole[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (filter: string) => void;
  updatingRole: string | null;
  updateUserRole: (userId: string, role: UserRole) => void;
  handleDeleteUser: (user: UserWithRole) => void;
  setShowAddUserForm: (show: boolean) => void;
}

export default function UserManagement({
  users,
  filteredUsers,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  updatingRole,
  updateUserRole,
  handleDeleteUser,
  setShowAddUserForm
}: UserManagementProps) {
  const { t } = useTranslations();
  
  return (
    <>
      {/* Поиск и фильтрация */}
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--muted)] mb-2">
              {t('admin.userManagement.searchUsers')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('admin.userManagement.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-white/20 rounded-lg leading-5 bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-[var(--muted)] mb-2">
              {t('admin.userManagement.filterByRole')}
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-white/20 rounded-lg leading-5 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            >
              <option value="all">{t('admin.userManagement.allRoles')}</option>
              <option value="admin">{t('admin.userManagement.administrators')}</option>
              <option value="user">{t('admin.userManagement.users')}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-[var(--muted)]">
          {t('admin.userManagement.showingResults', { filtered: filteredUsers.length, total: users.length })}
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="card p-4 sm:p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-[var(--muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-lg font-medium text-[var(--foreground)] mb-2">{t('admin.userManagement.noUsersFound')}</p>
              <p className="text-[var(--muted)]">
                {searchTerm || roleFilter !== 'all' 
                  ? t('admin.userManagement.tryDifferentSearch')
                  : t('admin.userManagement.usersWillAppearHere')
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-[var(--card)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      {t('admin.userManagement.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      {t('admin.userManagement.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      {t('admin.userManagement.currentRole')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      {t('admin.userManagement.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--card)] divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {user.userName}
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const isSuperAdmin = user.roles && Array.isArray(user.roles) && 
                              user.roles.some((r: string) => r?.toLowerCase() === 'superadmin');
                            const isAdmin = user.roles && Array.isArray(user.roles) && 
                              user.roles.some((r: string) => r?.toLowerCase() === 'admin');
                            
                            if (isSuperAdmin) {
                              return (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                                  Суперадмин
                                </span>
                              );
                            } else if (isAdmin) {
                              return (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                                  {t('admin.userManagement.administrators')}
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                                  {t('admin.userManagement.users')}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const isSuperAdmin = user.roles && Array.isArray(user.roles) && 
                              user.roles.some((r: string) => r?.toLowerCase() === 'superadmin');
                            
                            if (isSuperAdmin) {
                              return (
                                <>
                                  <span className="text-xs text-[var(--muted)] italic">Нельзя изменить</span>
                                  <span className="text-xs text-[var(--muted)] italic" title="Нельзя удалить суперадмина">
                                    <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  </span>
                                </>
                              );
                            } else {
                              const isAdmin = user.roles && Array.isArray(user.roles) && 
                                user.roles.some((r: string) => r?.toLowerCase() === 'admin');
                              return (
                                <>
                                  <select
                                    value={isAdmin ? 'Admin' : 'User'}
                                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                                    disabled={updatingRole === user.id}
                                    className="text-sm border border-white/20 rounded px-2 py-1 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50"
                                  >
                                    <option value="User">{t('admin.userManagement.users')}</option>
                                    <option value="Admin">{t('admin.userManagement.administrators')}</option>
                                  </select>
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                                    title={t('admin.userManagement.deleteUser')}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </>
                              );
                            }
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-[var(--card)] border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {user.userName}
                        </div>
                        <div className="text-xs text-[var(--muted)]">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const isSuperAdmin = user.roles && Array.isArray(user.roles) && 
                          user.roles.some((r: string) => r?.toLowerCase() === 'superadmin');
                        const isAdmin = user.roles && Array.isArray(user.roles) && 
                          user.roles.some((r: string) => r?.toLowerCase() === 'admin');
                        
                        if (isSuperAdmin) {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                              Суперадмин
                            </span>
                          );
                        } else if (isAdmin) {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                              {t('admin.userManagement.administrators')}
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                              {t('admin.userManagement.users')}
                            </span>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-[var(--muted)] mb-1">Email:</div>
                    <div className="text-sm text-[var(--foreground)] break-all">{user.email}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    {(() => {
                      const isSuperAdmin = user.roles && Array.isArray(user.roles) && 
                        user.roles.some((r: string) => r?.toLowerCase() === 'superadmin');
                      const isAdmin = user.roles && Array.isArray(user.roles) && 
                        user.roles.some((r: string) => r?.toLowerCase() === 'admin');
                      
                      if (isSuperAdmin) {
                        return (
                          <>
                            <div className="flex-1 text-xs text-[var(--muted)] italic flex items-center">
                              Роль нельзя изменить
                            </div>
                            <button
                              disabled
                              className="px-3 py-2 text-[var(--muted)] border border-[var(--muted)]/20 rounded transition-colors flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                              title="Нельзя удалить суперадмина"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span className="text-sm">{t('admin.userManagement.delete')}</span>
                            </button>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <select
                              value={isAdmin ? 'Admin' : 'User'}
                              onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                              disabled={updatingRole === user.id}
                              className="flex-1 text-sm border border-white/20 rounded px-3 py-2 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50"
                            >
                              <option value="User">{t('admin.userManagement.users')}</option>
                              <option value="Admin">{t('admin.userManagement.administrators')}</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-3 py-2 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-300/40 rounded transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm">{t('admin.userManagement.delete')}</span>
                            </button>
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
