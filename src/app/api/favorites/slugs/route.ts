import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { getFavoriteSlugs } from "@/services/user-service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    const favoriteSlugs = await getFavoriteSlugs(session.id);

    return ok({ favoriteSlugs });
  } catch (error) {
    return fail(error);
  }
}
