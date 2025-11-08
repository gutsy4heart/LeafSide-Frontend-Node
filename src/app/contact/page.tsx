"use client";

import { useTranslations } from "../../lib/translations";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                {t('contact.info.title')}
              </h2>
              <p className="text-lg text-[var(--muted)] mb-8">
                {t('contact.info.description')}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {t('contact.info.email.title')}
                    </h3>
                    <p className="text-[var(--muted)] mb-2">
                      {t('contact.info.email.address')}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {t('contact.info.email.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {t('contact.info.phone.title')}
                    </h3>
                    <p className="text-[var(--muted)] mb-2">
                      {t('contact.info.phone.number')}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {t('contact.info.phone.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {t('contact.info.address.title')}
                    </h3>
                    <p className="text-[var(--muted)] mb-2">
                      {t('contact.info.address.street')}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {t('contact.info.address.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                {t('contact.social.title')}
              </h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/30 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center hover:bg-pink-500/30 transition-colors">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              {t('contact.form.title')}
            </h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-500 font-medium">
                    {t('contact.form.success')}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--card)] border border-white/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--card)] border border-white/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  {t('contact.form.subject')}
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--card)] border border-white/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('contact.form.subjectPlaceholder')}</option>
                  <option value="general">{t('contact.form.subjects.general')}</option>
                  <option value="order">{t('contact.form.subjects.order')}</option>
                  <option value="technical">{t('contact.form.subjects.technical')}</option>
                  <option value="partnership">{t('contact.form.subjects.partnership')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[var(--card)] border border-white/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-accent py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  t('contact.form.send')
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            {t('contact.faq.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                {t('contact.faq.shipping.question')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('contact.faq.shipping.answer')}
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                {t('contact.faq.returns.question')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('contact.faq.returns.answer')}
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                {t('contact.faq.payment.question')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('contact.faq.payment.answer')}
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                {t('contact.faq.support.question')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('contact.faq.support.answer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
