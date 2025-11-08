"use client";
import Image from "next/image";
import { fetchJson } from "../lib/api";
import { useTranslations } from "../lib/translations";
import type { Book } from "../types/book";
import BookCard from "./components/BookCard";
import { useEffect, useState } from "react";

export default function Home() {
  const { t } = useTranslations();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchJson<Book[]>("/api/books");
        setBooks(booksData);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-[var(--muted)]">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl card">
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(1200px 400px at 10% -10%, rgba(52,211,153,0.25), transparent), radial-gradient(800px 400px at 90% -20%, rgba(59,130,246,0.18), transparent)"
        }} />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">{t('home.title')}</h1>
            <p className="mt-3 text-[var(--muted)]">{t('home.subtitle')}</p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#catalog" className="btn-accent">{t('home.viewCatalog')}</a>
              <a href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">{t('home.learnMore')}</a>
            </div>
          </div>
        </div>
      </section>

      <main id="catalog" className="grid gap-6 sm:gap-7 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </main>
    </div>
  );
}
