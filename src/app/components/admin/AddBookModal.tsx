"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "../../../lib/translations";
import { CreateBookRequest, BOOK_GENRES, BOOK_LANGUAGES } from "../../../types/book";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: CreateBookRequest) => void;
  creating: boolean;
  errors: Record<string, string>;
}

export default function AddBookModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  creating, 
  errors
}: AddBookModalProps) {
  const { t } = useTranslations();
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    language: 'Russian',
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
    price: 0,
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: 'Fiction',
      language: 'Russian',
      publishedYear: new Date().getFullYear(),
      pageCount: 0,
      price: 0,
      description: '',
      imageUrl: '',
      isAvailable: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Если URL изображения не указан, используем изображение по умолчанию
    const dataToSubmit = {
      ...formData,
      imageUrl: formData.imageUrl?.trim() || '/default-book-cover.svg'
    };
    
    onSubmit(dataToSubmit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  // Сброс формы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-white/10 rounded-lg p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
            {t('admin.modals.addBook.title')}
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
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.bookTitle')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)] ${
                  errors.title ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder={t('admin.modals.addBook.titlePlaceholder')}
                required
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.author')} *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)] ${
                  errors.author ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder={t('admin.modals.addBook.authorPlaceholder')}
                required
              />
              {errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.isbn')} *
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)] ${
                  errors.isbn ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder={t('admin.modals.addBook.isbnPlaceholder')}
                required
              />
              {errors.isbn && <p className="text-red-400 text-xs mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.genre')} *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)]"
              >
                {BOOK_GENRES.map(genre => (
                  <option key={genre} value={genre}>{t(`genres.${genre}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.language')} *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)]"
              >
                {BOOK_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{t(`languages.${lang}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.publishedYear')} *
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] ${
                  errors.publishedYear ? 'border-red-500' : 'border-white/20'
                }`}
                min="1000"
                max={new Date().getFullYear()}
                required
              />
              {errors.publishedYear && <p className="text-red-400 text-xs mt-1">{errors.publishedYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.pageCount')} *
              </label>
              <input
                type="number"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] ${
                  errors.pageCount ? 'border-red-500' : 'border-white/20'
                }`}
                min="1"
                required
              />
              {errors.pageCount && <p className="text-red-400 text-xs mt-1">{errors.pageCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.price')} *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] ${
                  errors.price ? 'border-red-500' : 'border-white/20'
                }`}
                min="0"
                step="0.01"
                required
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                {t('admin.modals.addBook.imageUrl')} <span className="text-[var(--muted)] text-xs">({t('admin.modals.addBook.optional')})</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)]"
                placeholder={t('admin.modals.addBook.imageUrlPlaceholder')}
              />
            </div>

            <div className="flex items-center sm:col-span-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--accent)] focus:ring-[var(--accent)] border-white/20 rounded bg-[var(--card)]"
              />
              <label className="ml-2 block text-sm text-[var(--muted)]">
                {t('admin.modals.addBook.available')}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">
              {t('admin.modals.addBook.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted)]"
              placeholder={t('admin.modals.addBook.descriptionPlaceholder')}
              rows={4}
            />
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
              {creating ? t('admin.modals.addBook.creating') : t('admin.modals.addBook.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
