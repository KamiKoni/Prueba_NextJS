import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);

    return ok({
      dashboard: {
        session,
        users: [],
        schedules: [],
        auditLogs: [],
      },
    });
  } catch (error) {
    return fail(error);
  }
}
