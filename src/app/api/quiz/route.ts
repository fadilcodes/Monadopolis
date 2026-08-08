import { NextResponse } from "next/server";
import { generateAIQuiz } from "@/lib/ai/gemini";

export async function GET() {
  try {
    const quiz = await generateAIQuiz();
    return NextResponse.json({ success: true, quiz });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memproses AI Quiz";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
