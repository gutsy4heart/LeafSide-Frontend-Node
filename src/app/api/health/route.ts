import { NextResponse } from "next/server";

const ENV_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

const CANDIDATES = [
  ENV_BASE,
  "http://localhost:5233",
  "http://127.0.0.1:5233",
  "https://localhost:7091",
].filter(Boolean);

export async function GET() {
  console.log('[Health API] Starting health check...');
  const results: Array<{ url: string; ok: boolean; status?: number; error?: string }> = [];
  
  for (const base of CANDIDATES) {
    if (!base) continue; // Skip empty strings
    const url = `${base}/api/health`;
    console.log(`[Health API] Trying: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.log(`[Health API] Timeout for ${url}`);
        controller.abort();
      }, 5000); // Increased timeout to 5 seconds
      
      const res = await fetch(url, { 
        method: "GET", 
        cache: "no-store", 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeout);
      console.log(`[Health API] Response from ${url}: ${res.status} ${res.statusText}`);
      
      results.push({ url: base, ok: res.ok, status: res.status });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`[Health API] Success with ${base}`);
        return NextResponse.json({ ok: true, selectedBase: base, data, tried: results });
      } else {
        const text = await res.text();
        results[results.length - 1].error = `Status ${res.status}: ${text}`;
        console.log(`[Health API] Failed with ${base}: ${res.status} - ${text}`);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`[Health API] Error with ${base}:`, errorMessage);
      results.push({ url: base, ok: false, error: errorMessage });
    }
  }
  
  console.error('[Health API] All attempts failed:', results);
  return NextResponse.json({ ok: false, selectedBase: null, tried: results }, { status: 502 });
}


