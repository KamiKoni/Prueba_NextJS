import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSession(request);
    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
