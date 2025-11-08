export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  language: string;
  pageCount: number;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  publishing?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  language: string;
  pageCount: number;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
  language?: string;
  pageCount?: number;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface BookResponse {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  language: string;
  pageCount: number;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology',
  'Art',
  'Poetry',
  'Drama',
  'Comedy',
  'Adventure',
  'Horror',
  'Philosophy',
  'Religion',
  'Education',
  'Health',
  'Travel',
  'Cooking',
  'Sports',
  'Other'
] as const;

export const BOOK_LANGUAGES = [
  'Russian',
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Other'
] as const;