import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import {
  clearAuthCookies,
  hashToken,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { isEnabledStatus, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { serializeSessionUser } from "@/lib/serializers";
import { createAuditLog } from "@/services/audit-service";
import {
  createRefreshSession,
  findRefreshSession,
  rotateRefreshSession,
} from "@/services/session-service";
import { findUserById } from "@/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!rawRefreshToken) {
      throw new AppError(401, "UNAUTHORIZED", "A refresh token is required.");
    }

    const payload = verifyRefreshToken(rawRefreshToken);
    const session = await findRefreshSession(payload.sessionId);
    const user = session ? await findUserById(session.userId) : null;

    if (!session || !user || session.revokedAt || session.expiresAt < new Date()) {
      throw new AppError(401, "UNAUTHORIZED", "The refresh token is no longer valid.");
    }

    if (session.tokenHash !== hashToken(rawRefreshToken)) {
      throw new AppError(401, "UNAUTHORIZED", "The refresh token is invalid.");
    }

    if (!isEnabledStatus(user.status)) {
      throw new AppError(401, "UNAUTHORIZED", "The account is inactive.");
    }

    const replacement = await createRefreshSession({
      userId: user._id,
      userAgent: request.headers.get("user-agent"),
      ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
    });

    const nextAccessToken = signAccessToken({
      sub: user._id.toHexString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const nextRefreshToken = signRefreshToken({
      sub: user._id.toHexString(),
      sessionId: replacement._id.toHexString(),
    });

    await rotateRefreshSession(session._id, replacement._id, hashToken(nextRefreshToken));

    await setAuthCookies(nextAccessToken, nextRefreshToken);
    await createAuditLog({
      actorId: user._id,
      action: "AUTH_REFRESH",
      entityType: "session",
      entityId: replacement._id.toHexString(),
      description: `${user.email} refreshed the session.`,
    });

    return ok({ user: serializeSessionUser(user) });
  } catch (error) {
    await clearAuthCookies();
    return fail(error);
  }
}
