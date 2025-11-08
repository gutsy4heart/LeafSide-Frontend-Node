import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:5233";

export async function POST(request: NextRequest) {
	console.log('=== Cart API Route - POST called ===');
	console.log('Cart API Route - Request URL:', request.url);
	console.log('Cart API Route - Request method:', request.method);
	
	try {
		const authHeader = request.headers.get("authorization");
		console.log('Cart API Route - Auth header exists:', !!authHeader);
		
		if (!authHeader) {
			console.error('Cart API Route - No authorization header');
			return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
		}

		const body = await request.json();
		console.log('Cart API Route - Received body:', JSON.stringify(body, null, 2));
		console.log('Cart API Route - body.bookId:', body.bookId, 'type:', typeof body.bookId);
		console.log('Cart API Route - body.BookId:', body.BookId, 'type:', typeof body.BookId);
		console.log('Cart API Route - body.quantity:', body.quantity, 'type:', typeof body.quantity);
		console.log('Cart API Route - body.Quantity:', body.Quantity, 'type:', typeof body.Quantity);
		
		// Бэкенд ожидает bookId и quantity (с маленькой буквы)
		// Преобразуем BookId -> bookId и Quantity -> quantity, если нужно
		const requestBody = {
			bookId: body.bookId || body.BookId,
			quantity: body.quantity !== undefined ? body.quantity : (body.Quantity !== undefined ? body.Quantity : 1)
		};
		
		console.log('Cart API Route - requestBody after mapping:', JSON.stringify(requestBody, null, 2));
		console.log('Cart API Route - requestBody.bookId:', requestBody.bookId, 'exists:', !!requestBody.bookId, 'type:', typeof requestBody.bookId);
		console.log('Cart API Route - requestBody.quantity:', requestBody.quantity, 'type:', typeof requestBody.quantity);
		
		// Валидация
		if (!requestBody.bookId) {
			console.error('Cart API Route - Validation failed: bookId is missing');
			console.error('Cart API Route - Original body:', JSON.stringify(body, null, 2));
			return NextResponse.json({ error: 'ID книги обязателен' }, { status: 400 });
		}
		if (!requestBody.quantity || requestBody.quantity < 1) {
			console.error('Cart API Route - Validation failed: quantity is invalid');
			return NextResponse.json({ error: 'Количество должно быть больше 0' }, { status: 400 });
		}
		
		// Проверяем, что bookId не пустая строка
		if (typeof requestBody.bookId === 'string' && requestBody.bookId.trim() === '') {
			console.error('Cart API Route - Validation failed: bookId is empty string');
			return NextResponse.json({ error: 'ID книги обязателен' }, { status: 400 });
		}
		
		const requestBodyString = JSON.stringify(requestBody);
		console.log('Cart API Route - Sending to backend URL:', `${BASE_URL}/api/Cart/items`);
		console.log('Cart API Route - Request body string:', requestBodyString);
		console.log('Cart API Route - Request body parsed back:', JSON.parse(requestBodyString));
		
		const res = await fetch(`${BASE_URL}/api/Cart/items`, {
			method: "POST",
			headers: {
				"Authorization": authHeader,
				"Content-Type": "application/json",
			},
			body: requestBodyString,
		});
		
		console.log('Cart API Route - Backend response status:', res.status, res.statusText);
		console.log('Cart API Route - Backend response ok:', res.ok);
		console.log('Cart API Route - Backend response headers:', Object.fromEntries(res.headers.entries()));

		if (!res.ok) {
			let errorMessage = "Upstream error";
			try {
				const contentType = res.headers.get('content-type');
				console.log('Cart API Route - Error response content-type:', contentType);
				
				const text = await res.text();
				console.error('Cart API Route - Error response text:', text);
				console.error('Cart API Route - Error response text length:', text?.length);
				
				// Пытаемся распарсить как JSON
				if (text && text.trim()) {
					try {
						const errorJson = JSON.parse(text);
						console.error('Cart API Route - Parsed error JSON:', JSON.stringify(errorJson, null, 2));
						errorMessage = errorJson.error || errorJson.message || text || errorMessage;
					} catch (jsonError) {
						// Если не JSON, используем текст как есть
						console.error('Cart API Route - Error is not JSON, using text');
						errorMessage = text || errorMessage;
					}
				} else {
					console.error('Cart API Route - Error response is empty');
					errorMessage = `HTTP ${res.status}: ${res.statusText}`;
				}
			} catch (textError) {
				console.error('Cart API Route - Failed to get error text:', textError);
				errorMessage = `HTTP ${res.status}: ${res.statusText}`;
			}
			
			console.error('Cart API Route - Returning error:', errorMessage);
			return NextResponse.json({ error: errorMessage }, { status: res.status });
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Fetch failed";
		console.error('Cart API - Exception:', message);
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
