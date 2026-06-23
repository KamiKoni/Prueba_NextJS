import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { success: false, error: { code: "REMOVED", message: "Schedules were replaced by recipes." } },
    { status: 410 },
  );
}

export const PATCH = GET;
export const DELETE = GET;
