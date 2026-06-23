import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { clearAuthCookies, verifyRefreshToken } from "@/lib/auth";
import { REFRESH_COOKIE_NAME } from "@/lib/constants";
import { createAuditLog } from "@/services/audit-service";
import { revokeRefreshSession } from "@/services/session-service";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await revokeRefreshSession(payload.sessionId);
        await createAuditLog({
          actorId: payload.sub,
          action: "AUTH_LOGOUT",
          entityType: "session",
          entityId: payload.sessionId,
          description: `${payload.sub} signed out.`,
        });
      } catch {
        // Logout is best-effort.
      }
    }

    await clearAuthCookies();
    return ok({ success: true });
  } catch (error) {
    return fail(error);
  }
}
