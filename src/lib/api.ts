const BASE_URL =
	process.env.API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:5233";

const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000";

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const isInternalApi = normalizedPath.startsWith("/api/");
	const url = isInternalApi ? `${ORIGIN}${normalizedPath}` : `${BASE_URL}${normalizedPath}`;
	const res = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
		cache: "no-store",
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Request failed ${res.status}: ${text}`);
	}
	return res.json();
}

