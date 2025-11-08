import { NextRequest, NextResponse } from "next/server";

function mapToAdminBook(b: any) {
  // Бэкенд хранит год издания в поле 'created' (строка)
  // Преобразуем в число, проверяя, что значение не пустое и не "0"
  console.log('mapToAdminBook - Input book:', { 
    id: b.id, 
    created: b.created, 
    createdType: typeof b.created,
    publishing: b.publishing,
    publishedYear: b.publishedYear 
  });
  
  // Бэкенд хранит год издания в поле 'created' (строка)
  // Преобразуем в число, проверяя, что значение не пустое и не "0"
  let publishedYear = new Date().getFullYear();
  
  // Сначала проверяем поле created (основное поле бэкенда)
  if (b.created !== undefined && b.created !== null) {
    const createdStr = String(b.created).trim();
    // Проверяем, что строка не пустая и не "0"
    if (createdStr && createdStr !== '' && createdStr !== '0') {
      const year = Number(createdStr);
      console.log('mapToAdminBook - Parsed year from created:', year, 'isNaN:', isNaN(year), 'year > 0:', year > 0);
      if (!isNaN(year) && year > 0 && year <= new Date().getFullYear() + 10) {
        publishedYear = year;
        console.log('mapToAdminBook - Using year from created:', publishedYear);
      } else {
        console.log('mapToAdminBook - Year from created is invalid, using default');
      }
    } else {
      console.log('mapToAdminBook - created is empty or "0", checking publishedYear');
    }
  } else {
    console.log('mapToAdminBook - created is undefined or null, checking publishedYear');
  }
  
  // Если created не дало результата, проверяем publishedYear
  if (publishedYear === new Date().getFullYear() && b.publishedYear !== undefined && b.publishedYear !== null && b.publishedYear > 0) {
    publishedYear = Number(b.publishedYear);
    console.log('mapToAdminBook - Using publishedYear:', publishedYear);
  }
  
  // Гарантируем, что publishedYear никогда не будет 0
  if (!publishedYear || publishedYear <= 0) {
    publishedYear = new Date().getFullYear();
    console.log('mapToAdminBook - publishedYear was 0 or invalid, using current year:', publishedYear);
  }
  
  if (publishedYear === new Date().getFullYear()) {
    console.log('mapToAdminBook - Using default year (current year):', publishedYear);
  }
  
  console.log('mapToAdminBook - Final publishedYear:', publishedYear);
  
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const { bookId } = await params;
    const body = await request.json();

    console.log('Update Book API Route - bookId:', bookId);
    console.log('Update Book API Route - body:', body);

    if (!bookId) {
      return NextResponse.json({ error: 'ID книги не указан' }, { status: 400 });
    }

    // Проверка обязательных полей
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    
    if (!title) {
      return NextResponse.json({ error: 'Название книги обязательно' }, { status: 400 });
    }

    if (!author) {
      return NextResponse.json({ error: 'Автор книги обязателен' }, { status: 400 });
    }

    // Преобразуем данные для бэкенда (бэкенд ожидает JSON, а не FormData)
    // Для publishedYear: если значение есть и больше 0, используем его, иначе текущий год
    const publishedYear = (body.publishedYear !== undefined && body.publishedYear !== null && body.publishedYear > 0) 
      ? body.publishedYear 
      : new Date().getFullYear();
    
    const requestData = {
      title: title,
      author: author,
      description: body.description || '',
      genre: body.genre || 'Other',
      publishing: body.publishing || '',
      created: body.created || String(publishedYear),
      imageUrl: body.imageUrl || body.coverImageUrl || '',
      price: body.price !== undefined && body.price !== null ? parseFloat(String(body.price)) : null,
      isbn: body.isbn || '',
      language: body.language || 'Russian',
      pageCount: body.pageCount || 0,
      isAvailable: body.isAvailable !== false,
    };

    console.log('Update Book API Route - Sending to backend:', requestData);
    console.log('Update Book API Route - publishedYear:', publishedYear, 'created:', requestData.created);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    const response = await fetch(`${backendUrl}/api/Books/${bookId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
      }
      if (response.status === 403) {
        return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
      }
      if (response.status === 400) {
        const errorData = await response.json();
        return NextResponse.json({ error: errorData.error || 'Ошибка валидации' }, { status: 400 });
      }

      const errorText = await response.text();
      return NextResponse.json({ error: `Ошибка сервера: ${errorText}` }, { status: response.status });
    }

    const book = await response.json();
    console.log('Update Book API Route - Backend returned book:', JSON.stringify(book, null, 2));
    console.log('Update Book API Route - book.created:', book.created, 'type:', typeof book.created);
    const mappedBook = mapToAdminBook(book);
    console.log('Update Book API Route - Mapped book.publishedYear:', mappedBook.publishedYear);
    return NextResponse.json(mappedBook);
  } catch (error) {
    console.error('Ошибка при обновлении книги:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    console.log('Delete Book API Route - Starting delete operation');
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      console.error('Delete Book API Route - No token provided');
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    let bookId: string;
    try {
      const resolvedParams = await params;
      bookId = resolvedParams.bookId;
      console.log('Delete Book API Route - bookId:', bookId);
    } catch (paramsError) {
      console.error('Delete Book API Route - Error resolving params:', paramsError);
      return NextResponse.json({ error: 'Ошибка при получении параметров запроса' }, { status: 400 });
    }

    if (!bookId) {
      console.error('Delete Book API Route - bookId is missing');
      return NextResponse.json({ error: 'ID книги не указан' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    const deleteUrl = `${backendUrl}/api/Books/${bookId}`;
    console.log('Delete Book API Route - Calling backend:', deleteUrl);
    
    let response;
    try {
      response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Delete Book API Route - Backend response received');
    } catch (fetchError) {
      console.error('Delete Book API Route - Fetch error:', fetchError);
      return NextResponse.json({ 
        error: `Ошибка подключения к бэкенду: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}` 
      }, { status: 502 });
    }

    console.log('Delete Book API Route - Response status:', response.status);
    console.log('Delete Book API Route - Response ok:', response.ok);
    
    // Бэкенд возвращает 204 (No Content) при успешном удалении
    // Также обрабатываем другие успешные статусы (200-299)
    if (response.status === 204 || (response.ok && response.status >= 200 && response.status < 300)) {
      console.log('Delete Book API Route - Book deleted successfully (status:', response.status, ')');
      return NextResponse.json({ success: true, message: 'Книга успешно удалена' });
    }
    
    // Обрабатываем ошибки
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
      }
      if (response.status === 403) {
        return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
      }

      let errorMessage = 'Ошибка сервера';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error('Delete Book API Route - Error parsing error response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    
    // Если мы дошли сюда, что-то пошло не так, но считаем удаление успешным
    console.log('Delete Book API Route - Unexpected response status, considering deletion successful');
    return NextResponse.json({ success: true, message: 'Книга успешно удалена' });
  } catch (error) {
    console.error('Delete Book API Route - Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Delete Book API Route - Error details:', { errorMessage, errorStack });
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
