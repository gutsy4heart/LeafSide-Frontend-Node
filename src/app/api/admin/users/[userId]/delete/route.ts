import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя не указан' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    console.log('Delete User API - Deleting user:', userId, 'from backend:', `${backendUrl}/api/AdminUsers/users/${userId}`);
    
    // Бэк реализует удаление пользователя в AdminUsersController
    const response = await fetch(`${backendUrl}/api/AdminUsers/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Delete User API - Backend response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
      }
      if (response.status === 403) {
        return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
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
        console.error('Delete User API - Error parsing error response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const result = await response.json().catch(() => ({ success: true }));
    console.log('Delete User API - Success result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
