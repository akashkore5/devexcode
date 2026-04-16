import { NextResponse } from 'next/server';
import dailyTerms from "../../../data/daily_terms.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const targetDate = date || new Date().toISOString().split("T")[0];
    const term = (dailyTerms as any[]).find((t) => t.date === targetDate);

    if (!term) {
      return NextResponse.json(
        { message: `No daily term found for ${targetDate}` },
        { status: 404 }
      );
    }

    return NextResponse.json(term);
  } catch (error) {
    console.error("Daily term API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
