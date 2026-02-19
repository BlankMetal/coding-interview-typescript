import { NextResponse } from "next/server";

const HEALTH_CHECK_URL = "https://simple-connectivity-check.vercel.app/";

export async function GET() {
  try {
    const response = await fetch(HEALTH_CHECK_URL);
    const text = await response.text();

    if (text.trim().toLowerCase() === "healthy") {
      return NextResponse.json({ healthy: true });
    }

    return NextResponse.json({ healthy: false, reason: "Unexpected response" }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ healthy: false, reason: String(error) }, { status: 502 });
  }
}
