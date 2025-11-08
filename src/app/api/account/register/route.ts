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

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Registration API - Received body:', body);
  const errors: Array<{ url: string; error: string }> = [];
  
  for (const base of CANDIDATES) {
    const url = `${base}/api/Account/register`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // Increased timeout to 10 seconds
      
      console.log('Registration API - Sending to backend:', url, body);
      
      const res = await fetch(url, { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), 
        signal: controller.signal 
      });
      
      clearTimeout(timeout);
      
      console.log('Registration API - Backend response:', res.status, res.statusText);
      
      if (!res.ok) {
        const text = await res.text();
        console.log('Registration API - Backend error response:', text);
        errors.push({ url, error: `${res.status} ${text}` });
        continue;
      }
      
      const responseData = await res.text();
      console.log('Registration API - Backend success response:', responseData);
      
      return new NextResponse(null, { status: 200 });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.log('Registration API - Request error:', errorMessage);
      errors.push({ url, error: errorMessage });
      
      // If it's a timeout error, try the next URL immediately
      if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
        continue;
      }
    }
  }
  
  console.error("All backend attempts failed:", errors);
  return NextResponse.json({ 
    error: "Backend unreachable", 
    message: "Unable to connect to the backend server. Please ensure the backend is running.",
    tried: errors 
  }, { status: 502 });
}


