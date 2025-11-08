"use client";

import type { Book } from "@/types/book";
import { fetchJson } from "@/lib/api";
import { notFound } from "next/navigation";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import { useTranslations } from "../../../lib/translations";
import { useEffect, useState } from "react";

type Props = { params: Promise<{ id: string }> };

export default function BookDetails({ params }: Props) {
  const { t } = useTranslations();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { id } = await params;
        const bookData = await fetchJson<Book>(`/api/books/${id}`);
        setBook(bookData);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes(" 404")) {
          notFound();
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('book.error')}</h1>
          <p className="text-[var(--muted)]">{error || t('book.notFound')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          ← {t('book.backToCatalog')}
        </Link>
      </div>
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 items-start">
        <div className="card p-6">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[var(--card)] mb-4">
            {book.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={book.imageUrl} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">{t('book.imageNotAvailable')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-[var(--foreground)] mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-[var(--muted)] mb-1">
              {t('book.author')}: <span className="font-medium">{book.author}</span>
            </p>
            {book.genre && (
              <p className="text-sm text-[var(--muted)]">
                {t('book.genre')}: <span className="font-medium">{book.genre}</span>
              </p>
            )}
            {book.publishing && (
              <p className="text-sm text-[var(--muted)]">
                {t('book.publisher')}: <span className="font-medium">{book.publishing}</span>
              </p>
            )}
          </div>
          
          {book.price != null && (
            <div className="py-4">
              <p className="text-3xl font-bold text-green-600">
                € {Number(book.price).toFixed(2)}
              </p>
              {!book.isAvailable && (
                <p className="text-sm text-red-500 font-medium mt-2">
                  ⚠️ {t('book.temporarilyUnavailable')}
                </p>
              )}
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('book.description')}</h2>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              {book.description || t('book.descriptionNotAvailable')}
            </p>
          </div>
          
          <div className="pt-4">
            <AddToCartButton bookId={book.id} bookTitle={book.title} isAvailable={book.isAvailable} />
          </div>
        </div>
      </div>
    </div>
  );
}


