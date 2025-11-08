import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:5233";

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get("authorization");
		if (!authHeader) {
			console.log('Profile API - No authorization header');
			return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
		}

		console.log('Profile API - Fetching profile from backend:', `${BASE_URL}/api/Account/profile`);

		const res = await fetch(`${BASE_URL}/api/Account/profile`, {
			method: "GET",
			headers: {
				"Authorization": authHeader,
				"Content-Type": "application/json",
			},
		});

		console.log('Profile API - Backend response status:', res.status, res.statusText);

		if (!res.ok) {
			const text = await res.text();
			console.log('Profile API - Backend error:', text);
			return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
		}

		const data = await res.json();
		console.log('Profile API - Backend data received:', data);
		console.log('Profile API - Data properties:', {
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
			countryCode: data.countryCode,
			gender: data.gender,
			FirstName: data.FirstName,
			LastName: data.LastName,
			PhoneNumber: data.PhoneNumber,
			CountryCode: data.CountryCode,
			Gender: data.Gender
		});
		
		return NextResponse.json(data);
	} catch (err: unknown) {
		console.error('Profile API - Error:', err);
		const message = err instanceof Error ? err.message : "Fetch failed";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		console.log('API route /api/account/profile PUT вызван');
		
		const authHeader = request.headers.get("authorization");
		if (!authHeader) {
			console.log('Токен авторизации не найден');
			return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
		}

		const body = await request.json();
		console.log('Тело запроса:', body);

		console.log('Отправляем запрос на бэкенд:', `${BASE_URL}/api/Account/profile`);

		const res = await fetch(`${BASE_URL}/api/Account/profile`, {
			method: "PUT",
			headers: {
				"Authorization": authHeader,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		console.log('Ответ бэкенда:', res.status, res.statusText);
		console.log('Content-Type бэкенда:', res.headers.get('content-type'));

		if (!res.ok) {
			const contentType = res.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const errorData = await res.json();
				console.error('Ошибка бэкенда (JSON):', errorData);
				return NextResponse.json({ error: errorData.message || errorData.error || "Upstream error" }, { status: res.status });
			} else {
				const text = await res.text();
				console.error('Ошибка бэкенда (не JSON):', text.substring(0, 200));
				return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
			}
		}

		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const data = await res.json();
			console.log('Получены данные от бэкенда:', data);
			return NextResponse.json(data);
		} else {
			// Если ответ не JSON, но статус OK, возвращаем успех
			console.log('Бэкенд вернул не JSON, но статус OK');
			return NextResponse.json({ success: true });
		}
	} catch (err: unknown) {
		console.error('Ошибка при обновлении профиля:', err);
		const message = err instanceof Error ? err.message : "Fetch failed";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}