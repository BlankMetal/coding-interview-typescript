import { NextResponse } from "next/server";
import { runTests } from "@/lib/runner";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const challengeLevel = body.challenge_level;
    const scenarioName = body.scenario_name;
    
    const result = await runTests(challengeLevel, scenarioName);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unknown error occurred",
        results: [],
      },
      { status: 500 }
    );
  }
}
