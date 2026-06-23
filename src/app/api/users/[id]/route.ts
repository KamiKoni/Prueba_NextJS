import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { success: false, error: { code: "REMOVED", message: "User management is not part of this recipe app." } },
    { status: 410 },
  );
}

export const PATCH = GET;
export const DELETE = GET;
