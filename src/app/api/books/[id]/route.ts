import { NextResponse } from "next/server";

const ENV_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const errors: Array<{ url: string; error: string }> = [];

  for (const base of CANDIDATES) {
    const url = `${base}/api/Books/${encodeURIComponent(id)}`;
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
        // If backend says Not Found, surface 404 directly to the client
        if (res.status === 404) {
          const payload = await res.text();
          try {
            return new NextResponse(payload, { status: 404, headers: { "Content-Type": "application/json" } });
          } catch {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
          }
        }
        const text = await res.text();
        errors.push({ url, error: `${res.status} ${text}` });
        continue;
      }
      const data = await res.json();
      // Ensure price is a number
      const mappedData = mapBook(data);
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


