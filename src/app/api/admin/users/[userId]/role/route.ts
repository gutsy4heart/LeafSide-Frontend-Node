import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const { userId } = await params;
    const body = await request.json();
    
    console.log('Role API - Received request body:', body);
    
    // Ensure role is a string and validate it
    if (body.role === undefined || body.role === null) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }
    
    let roleString: string;
    
    // Handle different input types
    if (typeof body.role === 'string') {
      roleString = body.role.trim();
    } else if (typeof body.role === 'number') {
      // Convert number to role name
      if (body.role === 1) {
        roleString = 'Admin';
      } else if (body.role === 0) {
        roleString = 'User';
      } else {
        roleString = String(body.role);
      }
    } else if (body.role === '1' || body.role === 1) {
      roleString = 'Admin';
    } else if (body.role === '0' || body.role === 0) {
      roleString = 'User';
    } else {
      const str = String(body.role).trim();
      // Try to convert string numbers
      if (str === '1') {
        roleString = 'Admin';
      } else if (str === '0') {
        roleString = 'User';
      } else {
        roleString = str;
      }
    }
    
    // Normalize role name (handle case variations)
    if (roleString.toLowerCase() === 'admin') {
      roleString = 'Admin';
    } else if (roleString.toLowerCase() === 'user') {
      roleString = 'User';
    }
    
    // Validate role value
    if (roleString !== 'Admin' && roleString !== 'User') {
      console.error('Role API - Invalid role value:', { 
        original: body.role, 
        originalType: typeof body.role,
        converted: roleString,
        body: body 
      });
      return NextResponse.json({ error: `Invalid role: "${roleString}" (original: ${body.role}). Must be "Admin" or "User"` }, { status: 400 });
    }
    
    body.role = roleString;
    
    console.log('Role API - Updating role:', { userId, originalRole: body.role, role: roleString, bodyType: typeof body.role });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5233';
    const response = await fetch(`${backendUrl}/api/AdminUsers/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
      
      const errorText = await response.text();
      return NextResponse.json({ error: `Ошибка сервера: ${errorText}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении роли пользователя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
