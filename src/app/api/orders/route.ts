import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5233';

export async function POST(request: NextRequest) {
  try {
    console.log('API route /api/orders вызван');
    const body = await request.json();
    const { items, totalAmount } = body;
    console.log('Получены данные:', { items, totalAmount });

    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не найден' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Валидация данных
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Список товаров не может быть пустым' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Сумма заказа должна быть больше 0' },
        { status: 400 }
      );
    }

    // Подготавливаем данные для отправки на бэкенд
    const orderData = {
      items: items.map((item: any) => ({
        bookId: item.bookId,
        quantity: item.quantity
      })),
      totalAmount: totalAmount
    };

    // Отправляем запрос на бэкенд
    console.log('Отправляем запрос на бэкенд:', `${API_BASE_URL}/api/orders`);
    console.log('Данные для бэкенда:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    console.log('Ответ бэкенда:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Ошибка при создании заказа' },
        { status: response.status }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items
      }
    });

  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('API route /api/orders GET вызван');
    
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Токен авторизации не найден');
      return NextResponse.json(
        { error: 'Токен авторизации не найден' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('Токен получен:', token.substring(0, 20) + '...');

    console.log('Отправляем запрос на бэкенд:', `${API_BASE_URL}/api/orders`);

    // Получаем заказы пользователя
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Ответ бэкенда:', response.status, response.statusText);
    console.log('Content-Type бэкенда:', response.headers.get('content-type'));

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка бэкенда (JSON):', errorData);
        return NextResponse.json(
          { error: errorData.message || 'Ошибка при получении заказов' },
          { status: response.status }
        );
      } else {
        const text = await response.text();
        console.error('Ошибка бэкенда (не JSON):', text.substring(0, 200));
        return NextResponse.json(
          { error: `Ошибка бэкенда: ${text.substring(0, 100)}` },
          { status: response.status }
        );
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const orders = await response.json();
      console.log('Получены заказы от бэкенда:', orders);
      
      return NextResponse.json({
        success: true,
        orders: orders
      });
    } else {
      const text = await response.text();
      console.error('Бэкенд вернул не JSON:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Бэкенд вернул неожиданный формат данных' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API route /api/orders PUT вызван');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не найден' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const url = new URL(request.url);
    const orderId = url.pathname.split('/').pop();

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
