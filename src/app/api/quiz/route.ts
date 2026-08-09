const AI_DISABLED_MESSAGE =
  "This is for Hackathon purpose only, no use of API key for any reason";

export function GET() {
  return Response.json(
    { success: false, error: AI_DISABLED_MESSAGE },
    {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
