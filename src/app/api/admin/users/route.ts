import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    console.log('Admin Users API - Fetching users from backend:', `${backendUrl}/api/AdminUsers/users`);
    
    const response = await fetch(`${backendUrl}/api/AdminUsers/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Admin Users API - Backend response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
      }
      if (response.status === 403) {
        return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
      }
      
      const errorText = await response.text();
      console.log('Admin Users API - Backend error response:', errorText);
      return NextResponse.json({ error: `Ошибка сервера: ${errorText}` }, { status: response.status });
    }

    const users = await response.json();
    console.log('Admin Users API - Users received from backend:', users);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Admin Users API - POST request received');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Admin Users API - No token provided');
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Admin Users API - Request body:', body);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    console.log('Admin Users API - Backend URL:', backendUrl);
    
    const response = await fetch(`${backendUrl}/api/AdminUsers/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Admin Users API - Backend response status:', response.status, response.statusText);
    console.log('Admin Users API - Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Ошибка при создании пользователя';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('Admin Users API - Backend error data:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          console.log('Admin Users API - Backend error text:', errorText);
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error('Admin Users API - Error parsing backend response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    let result;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { success: true };
      }
    } catch (parseError) {
      console.error('Admin Users API - Error parsing success response:', parseError);
      result = { success: true };
    }

    console.log('Admin Users API - Success result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}