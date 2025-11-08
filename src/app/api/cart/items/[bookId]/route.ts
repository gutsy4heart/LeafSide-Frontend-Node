import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:5233";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ bookId: string }> }
) {
	try {
		const { bookId } = await params;
		const authHeader = request.headers.get("authorization");
		if (!authHeader) {
			return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
		}

		const res = await fetch(`${BASE_URL}/api/Cart/items/${bookId}`, {
			method: "DELETE",
			headers: {
				"Authorization": authHeader,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const text = await res.text();
			return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Fetch failed";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
