import { NextRequest, NextResponse } from "next/server";

// Map backend catalog book to admin book shape
function mapToAdminBook(b: any) {
  // Бэкенд хранит год издания в поле 'created' (строка)
  // Преобразуем в число, проверяя, что значение не пустое и не "0"
  let publishedYear = new Date().getFullYear();
  
  // Сначала проверяем поле created (основное поле бэкенда)
  if (b.created !== undefined && b.created !== null) {
    const createdStr = String(b.created).trim();
    // Проверяем, что строка не пустая и не "0"
    if (createdStr && createdStr !== '' && createdStr !== '0') {
      const year = Number(createdStr);
      if (!isNaN(year) && year > 0 && year <= new Date().getFullYear() + 10) {
        publishedYear = year;
      }
    }
  }
  
  // Если created не дало результата, проверяем publishedYear
  if (publishedYear === new Date().getFullYear() && b.publishedYear !== undefined && b.publishedYear !== null && b.publishedYear > 0) {
    publishedYear = Number(b.publishedYear);
  }
  
  // Гарантируем, что publishedYear никогда не будет 0
  if (!publishedYear || publishedYear <= 0) {
    publishedYear = new Date().getFullYear();
  }
  
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    description: b.description ?? "",
    isbn: b.isbn ?? "",
    publishedYear: publishedYear,
    genre: b.genre ?? "Other",
    language: b.language ?? "Russian",
    pageCount: Number(b.pageCount ?? 0),
    price: Number(b.price ?? 0),
    imageUrl: b.imageUrl ?? b.coverImageUrl ?? "",
    isAvailable: b.isAvailable ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Токен не предоставлен" }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5233";
    const res = await fetch(`${backendUrl}/api/Books`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Ошибка сервера: ${text}` }, { status: res.status });
    }

      const books = await res.json();
      console.log('Books API Route - Raw books from backend:', JSON.stringify(books, null, 2));
      if (Array.isArray(books) && books.length > 0) {
        console.log('Books API Route - First book raw data:', JSON.stringify(books[0], null, 2));
        console.log('Books API Route - First book created field:', books[0].created, 'type:', typeof books[0].created);
      }
      const mappedBooks = Array.isArray(books) ? books.map(mapToAdminBook) : [];
      if (mappedBooks.length > 0) {
        console.log('Books API Route - First mapped book publishedYear:', mappedBooks[0].publishedYear);
      }
      return NextResponse.json(mappedBooks);
  } catch (error) {
    console.error("Ошибка при получении книг:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('=== Books API Route - POST called ===');
  console.log('Books API Route - Request URL:', request.url);
  console.log('Books API Route - Request method:', request.method);
  console.log('Books API Route - Request headers:', Object.fromEntries(request.headers.entries()));
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      console.error('Books API Route - No token provided');
      return NextResponse.json({ error: "Токен не предоставлен" }, { status: 401 });
    }
    console.log('Books API Route - Token received');

    let body;
    try {
      body = await request.json();
      console.log('Books API Route - JSON parsed successfully');
    } catch (parseError) {
      console.error('Books API Route - Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Неверный формат данных' }, { status: 400 });
    }

    // Логирование для отладки
    console.log('Books API Route - Received body:', JSON.stringify(body, null, 2));
    console.log('Books API Route - Body type:', typeof body);
    console.log('Books API Route - Body is array:', Array.isArray(body));
    console.log('Books API Route - Body keys:', Object.keys(body || {}));
    console.log('Books API Route - Title value:', body?.title);
    console.log('Books API Route - Title type:', typeof body?.title);
    console.log('Books API Route - Title length:', body?.title?.length);
    console.log('Books API Route - Body has title property:', 'title' in (body || {}));
    console.log('Books API Route - Body.title === undefined:', body?.title === undefined);
    console.log('Books API Route - Body.title === null:', body?.title === null);

    // Проверка обязательных полей
    console.log('Books API Route - Before validation, body.title:', body.title);
    console.log('Books API Route - Before validation, body.author:', body.author);
    
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    
    console.log('Books API Route - After trim, title:', title);
    console.log('Books API Route - After trim, author:', author);
    
    if (!title) {
      console.error('Books API Route - Validation failed: title is missing or empty', { 
        bodyTitle: body.title, 
        titleType: typeof body.title,
        titleLength: body.title?.length,
        trimmedTitle: title,
        body: JSON.stringify(body, null, 2)
      });
      return NextResponse.json({ error: 'Название книги обязательно' }, { status: 400 });
    }

    if (!author) {
      console.error('Books API Route - Validation failed: author is missing or empty', { 
        bodyAuthor: body.author, 
        authorType: typeof body.author,
        authorLength: body.author?.length,
        trimmedAuthor: author,
        body: JSON.stringify(body, null, 2)
      });
      return NextResponse.json({ error: 'Автор книги обязателен' }, { status: 400 });
    }
    
    console.log('Books API Route - Validation passed, title:', title, 'author:', author);

    // Преобразуем данные для бэкенда (бэкенд ожидает JSON, а не FormData)
    const requestData = {
      title: title,
      author: author,
      description: body.description || '',
      genre: body.genre || 'Other',
      publishing: body.publishing || '',
      created: body.created || (body.publishedYear !== undefined && body.publishedYear !== null ? String(body.publishedYear) : String(new Date().getFullYear())),
      imageUrl: body.imageUrl || body.coverImageUrl || '',
      price: body.price !== undefined && body.price !== null ? parseFloat(String(body.price)) : null,
      isbn: body.isbn || '',
      language: body.language || 'Russian',
      pageCount: body.pageCount || 0,
      isAvailable: body.isAvailable !== false,
    };

    console.log('Books API Route - Sending to backend:', requestData);
    console.log('Books API Route - JSON stringified:', JSON.stringify(requestData));

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5233";
    const res = await fetch(`${backendUrl}/api/Books`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
    });

    console.log('Books API Route - Backend response status:', res.status, res.statusText);

    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
        console.error('Books API Route - Backend error response:', errorText);
        // Попробуем распарсить как JSON
        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json({ error: errorJson.error || errorText }, { status: res.status });
        } catch {
          // Если не JSON, возвращаем как текст
          return NextResponse.json({ error: errorText || `HTTP ${res.status}: ${res.statusText}` }, { status: res.status });
        }
      } catch (e) {
        console.error('Books API Route - Error reading error response:', e);
        return NextResponse.json({ error: `Ошибка сервера: HTTP ${res.status}` }, { status: res.status });
      }
    }

    const created = await res.json();
    return NextResponse.json(mapToAdminBook(created));
  } catch (error) {
    console.error("Ошибка при создании книги:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
