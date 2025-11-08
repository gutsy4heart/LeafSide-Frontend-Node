"use client";

import { useCart } from "@/app/cart-context";
import { useTranslations } from "@/lib/translations";
import { useState } from "react";

interface AddToCartButtonProps {
  bookId: string;
  bookTitle: string;
  isAvailable: boolean;
}

export default function AddToCartButton({ bookId, bookTitle, isAvailable }: AddToCartButtonProps) {
  const { add } = useCart();
  const { t } = useTranslations();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!isAvailable) {
      return; // Don't add unavailable books
    }
    
    console.log('AddToCartButton - handleAddToCart called with bookId:', bookId, 'type:', typeof bookId, 'exists:', !!bookId);
    
    setIsAdding(true);
    try {
      await add(bookId, 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("AddToCartButton - Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">{t('book.addToCart')}!</span>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-6 py-3 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="font-medium">{t('book.unavailable')}</span>
      </div>
    );
  }

  return (
    <button 
      className={`btn-accent flex items-center gap-2 px-6 py-3 text-lg font-medium transition-all duration-200 ${
        isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
      }`}
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
{t('book.adding')}...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 16a2 2 0 104 0 2 2 0 00-4 0m8 0a2 2 0 104 0 2 2 0 00-4 0" />
          </svg>
{t('book.addToCart')}
        </>
      )}
    </button>
  );
}
