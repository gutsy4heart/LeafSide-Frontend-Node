import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('Profile API: Получен запрос, токен:', token ? 'присутствует' : 'отсутствует');
    
    if (!token) {
      console.log('Profile API: Токен не предоставлен');
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    console.log('Profile API: Отправляем запрос на', `${backendUrl}/api/Account/profile`);
    
    const response = await fetch(`${backendUrl}/api/Account/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Profile API: Получен ответ от бэкенда:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Profile API: Ошибка от бэкенда:', errorText);
      
      if (response.status === 401) {
        return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }
      return NextResponse.json({ error: `Ошибка сервера: ${errorText}` }, { status: response.status });
    }

    const userProfile = await response.json();
    console.log('Profile API: Успешно получен профиль:', userProfile);
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile API: Ошибка при получении профиля:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
