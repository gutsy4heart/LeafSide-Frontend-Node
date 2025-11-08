"use client";

import { Book } from "../../types/book";
import { useCart } from "../cart-context";
import { useTranslations } from "../../lib/translations";
import { useState } from "react";
import Link from "next/link";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { add } = useCart();
  const { t } = useTranslations();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!book.isAvailable) {
      return; // Don't add unavailable books
    }
    
    console.log('BookCard - handleAddToCart called with book.id:', book.id, 'type:', typeof book.id, 'exists:', !!book.id);
    
    setIsAdding(true);
    try {
      await add(book.id, 1);
    } catch (error) {
      console.error('BookCard - Error adding to cart:', error);
    } finally {
      // Small delay for visual effect
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <div className={`card p-4 block hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 group ${
      !book.isAvailable ? 'opacity-75' : ''
    }`}>
      <Link href={`/books/${book.id}`} className="block">
        <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-[var(--card)] relative">
          {!book.isAvailable && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
              {t('book.unavailable')}
            </div>
          )}
          {book.imageUrl ? (
            <img 
              src={book.imageUrl} 
              alt={book.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">{t('book.noImage')}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </div>
        
        <h2 className="font-medium leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">{book.author}</p>
        {book.price != null && (
          <p className="mt-2 font-semibold text-green-600">
            € {Number(book.price).toFixed(2)}
          </p>
        )}
        <div className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {t('book.clickForDetails')} →
        </div>
      </Link>
      
      {/* Add to cart button */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !book.isAvailable}
          className={`w-full py-2 px-3 rounded-md transition-colors text-sm font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            !book.isAvailable
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isAdding
              ? 'bg-[var(--accent)]/50 text-white'
              : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/80'
          }`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('book.adding')}...
            </>
          ) : !book.isAvailable ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('book.unavailable')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 16a2 2 0 104 0 2 2 0 00-4 0m8 0a2 2 0 104 0 2 2 0 00-4 0" />
              </svg>
              {t('book.addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
