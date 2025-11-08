import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:5233";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { token } = body;

		if (!token) {
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		const res = await fetch(`${BASE_URL}/api/Account/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token }),
		});

		if (!res.ok) {
			const text = await res.text();
			return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Fetch failed";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
