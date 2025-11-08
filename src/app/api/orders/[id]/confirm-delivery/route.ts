import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5233';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API route /api/orders/[id]/confirm-delivery PUT вызван');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не найден' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID заказа не указан' },
        { status: 400 }
      );
    }

    console.log('Подтверждаем доставку заказа:', orderId);

    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/confirm-delivery`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Ответ бэкенда:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Ошибка при подтверждении доставки' },
        { status: response.status }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Ошибка при подтверждении доставки:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
