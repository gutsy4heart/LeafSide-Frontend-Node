import { NextResponse } from "next/server";

const ENV_BASE =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"";

// Candidate backend URLs to try in dev
const CANDIDATES = [
	ENV_BASE,
	"http://localhost:5233",
	"http://127.0.0.1:5233",
	"https://localhost:7091",
].filter(Boolean);

// Map backend book to frontend book shape, ensuring price is a number
function mapBook(b: any) {
	return {
		...b,
		price: Number(b.price ?? 0),
		publishedYear: Number(b.publishing ?? b.publishedYear ?? new Date().getFullYear()),
		pageCount: Number(b.pageCount ?? 0),
	};
}

export async function GET() {
	const errors: Array<{ url: string; error: string }> = [];

	for (const base of CANDIDATES) {
		const url = `${base}/api/Books`;
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 4000);
			const res = await fetch(url, {
				headers: { "Content-Type": "application/json" },
				cache: "no-store",
				signal: controller.signal,
			});
			clearTimeout(timeout);
			if (!res.ok) {
				const text = await res.text();
				errors.push({ url, error: `${res.status} ${text}` });
				continue;
			}
			const data = await res.json();
			// Ensure price is a number for all books
			const mappedData = Array.isArray(data) ? data.map(mapBook) : mapBook(data);
			return NextResponse.json(mappedData);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e);
			errors.push({ url, error: msg });
		}
	}

	return NextResponse.json(
		{ error: "Backend unreachable", tried: errors },
		{ status: 502 }
	);
}


