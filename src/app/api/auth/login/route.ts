import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import { fail, ok, parseBody } from "@/lib/api";
import { hashToken, setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth";
import { isEnabledStatus } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { loginSchema } from "@/lib/schemas";
import { serializeSessionUser } from "@/lib/serializers";
import { createAuditLog } from "@/services/audit-service";
import { createRefreshSession, updateRefreshTokenHash } from "@/services/session-service";
import { findUserByEmail } from "@/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const payload = await parseBody(request, loginSchema);
    const user = await findUserByEmail(payload.email);

    if (!user || !isEnabledStatus(user.status)) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const refreshRecord = await createRefreshSession({
      userId: user._id,
      userAgent: request.headers.get("user-agent"),
      ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
    });

    const accessToken = signAccessToken({
      sub: user._id.toHexString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const refreshToken = signRefreshToken({
      sub: user._id.toHexString(),
      sessionId: refreshRecord._id.toHexString(),
    });

    await updateRefreshTokenHash(refreshRecord._id, hashToken(refreshToken));

    await setAuthCookies(accessToken, refreshToken);
    await createAuditLog({
      actorId: user._id,
      action: "AUTH_LOGIN",
      entityType: "session",
      entityId: refreshRecord._id.toHexString(),
      description: `${user.email} signed in.`,
    });

    return ok({ user: serializeSessionUser(user) });
  } catch (error) {
    return fail(error);
  }
}
