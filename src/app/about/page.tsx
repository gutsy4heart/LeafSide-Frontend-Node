"use client";

import { useTranslations } from "../../lib/translations";

export default function AboutPage() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-[var(--muted)] mb-4">
              {t('about.mission.description')}
            </p>
            <p className="text-lg text-[var(--muted)]">
              {t('about.mission.goal')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              {t('about.mission.values')}
            </h3>
            <ul className="space-y-2 text-[var(--muted)]">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {t('about.mission.quality')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {t('about.mission.accessibility')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {t('about.mission.community')}
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            {t('about.features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('about.features.curated.title')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('about.features.curated.description')}
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('about.features.fast.title')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('about.features.fast.description')}
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('about.features.quality.title')}
              </h3>
              <p className="text-[var(--muted)]">
                {t('about.features.quality.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            {t('about.team.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                {t('about.team.alex.name')}
              </h3>
              <p className="text-blue-500 mb-2">{t('about.team.alex.role')}</p>
              <p className="text-[var(--muted)] text-sm">
                {t('about.team.alex.description')}
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                {t('about.team.maria.name')}
              </h3>
              <p className="text-green-500 mb-2">{t('about.team.maria.role')}</p>
              <p className="text-[var(--muted)] text-sm">
                {t('about.team.maria.description')}
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                D
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                {t('about.team.dmitry.name')}
              </h3>
              <p className="text-purple-500 mb-2">{t('about.team.dmitry.role')}</p>
              <p className="text-[var(--muted)] text-sm">
                {t('about.team.dmitry.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            {t('about.stats.title')}
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">1000+</div>
              <p className="text-[var(--muted)]">{t('about.stats.books')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
              <p className="text-[var(--muted)]">{t('about.stats.customers')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
              <p className="text-[var(--muted)]">{t('about.stats.authors')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">99%</div>
              <p className="text-[var(--muted)]">{t('about.stats.satisfaction')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="btn-accent px-8 py-3 text-lg font-medium"
            >
              {t('about.cta.explore')}
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 text-lg font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              {t('about.cta.contact')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
