"use client";

import { useState } from "react";
import { useTranslations } from "../../../lib/translations";
import CountrySelect from "../CountrySelect";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    gender: string;
  }) => void;
  creating: boolean;
  errors: Record<string, string>;
}

export default function AddUserModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  creating, 
  errors 
}: AddUserModalProps) {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    countryCode: 'KZ',
    phoneCode: '+7',
    gender: 'Male'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Прогресс заполнения формы
  const getFormProgress = () => {
    const fields = [formData.firstName, formData.lastName, formData.email, formData.phoneNumber, formData.gender, formData.password];
    const filledFields = fields.filter(field => field.trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-white/10 rounded-lg p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
            {t('admin.modals.addUser.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Прогресс-бар */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">{t('admin.modals.addUser.progress')}</span>
              <span className="text-[var(--foreground)] font-medium">{getFormProgress()}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getFormProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Личная информация */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('admin.modals.addUser.personalInfo')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('admin.modals.addUser.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-white/20'
                  }`}
                  placeholder={t('admin.modals.addUser.firstNamePlaceholder')}
                  required
                  disabled={creating}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {t('admin.modals.addUser.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-white/20'
                  }`}
                  placeholder={t('admin.modals.addUser.lastNamePlaceholder')}
                  required
                  disabled={creating}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('admin.modals.addUser.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20'
                }`}
                placeholder={t('admin.modals.addUser.emailPlaceholder')}
                required
                disabled={creating}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('admin.modals.addUser.contactInfo')}
              </h3>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('admin.modals.addUser.phone')} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-40">
                  <CountrySelect
                    value={formData.countryCode}
                    onChange={(code, phone) => {
                      setFormData(prev => ({ ...prev, countryCode: code, phoneCode: phone }));
                    }}
                    disabled={creating}
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`flex-1 h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-white/20'
                  }`}
                  placeholder={t('admin.modals.addUser.phonePlaceholder')}
                  required
                  disabled={creating}
                />
              </div>
              {errors.phoneNumber ? (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.phoneNumber}
                </p>
              ) : (
                <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('admin.modals.addUser.selectedCountry')}: <span className="font-medium text-[var(--foreground)]">{formData.phoneCode}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('admin.modals.addUser.gender')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "Male", label: t('admin.modals.addUser.male'), icon: "👨" },
                  { value: "Female", label: t('admin.modals.addUser.female'), icon: "👩" },
                  { value: "Other", label: t('admin.modals.addUser.other'), icon: "👤" }
                ].map((option) => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleChange}
                      disabled={creating}
                      className="sr-only"
                    />
                    <div className={`w-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.gender === option.value 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : errors.gender
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-white/20 bg-[var(--card)] hover:border-white/40 hover:bg-[var(--card)]/80'
                    } ${creating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-xs font-medium text-[var(--foreground)] text-center">{option.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Безопасность */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('admin.modals.addUser.security')}
              </h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('admin.modals.addUser.password')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20'
                }`}
                placeholder={t('admin.modals.addUser.passwordPlaceholder')}
                required
                disabled={creating}
              />
              {errors.password ? (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password}
                </p>
              ) : formData.password ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          formData.password.length >= 8 ? 'bg-green-500' : 
                          formData.password.length >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((formData.password.length / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      {formData.password.length >= 8 ? t('admin.modals.addUser.strong') : formData.password.length >= 6 ? t('admin.modals.addUser.medium') : t('admin.modals.addUser.weak')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    {t('admin.modals.addUser.passwordRequirement')}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">
                  {t('admin.modals.addUser.passwordRequirement')}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--muted)] bg-[var(--card)] border border-white/20 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] bg-[var(--accent)] border border-transparent rounded-lg hover:bg-[var(--accent)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 transition-colors"
            >
              {creating ? t('admin.modals.addUser.creating') : t('admin.modals.addUser.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
