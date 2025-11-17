import { NextResponse } from "next/server";
import { BACKEND_ENDPOINT } from "@/lib/solution";

export async function GET() {
  try {
    // Check if backend endpoint is configured
    if (!BACKEND_ENDPOINT || BACKEND_ENDPOINT.trim() === "") {
      return NextResponse.json(
        { levels: 6, scenarios: ['ticket_pricing'] },
        { status: 200 }
      );
    }

    const response = await fetch(`${BACKEND_ENDPOINT}/levels`);

    if (!response.ok) {
      throw new Error(`Failed to fetch levels: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching levels:", error);
    // Return default levels if backend is unavailable
    return NextResponse.json(
      { levels: 6, scenarios: ['ticket_pricing'] },
      { status: 200 }
    );
  }
}
