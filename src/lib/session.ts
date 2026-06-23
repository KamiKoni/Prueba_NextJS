import type { NextRequest } from "next/server";

import { verifyAccessToken } from "@/lib/auth";
import { ACCESS_COOKIE_NAME, isEnabledStatus } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { findUserById } from "@/services/user-service";

export async function requireSession(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessToken) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  let payload: { sub: string };

  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Your session has expired.");
  }

  const user = await findUserById(payload.sub);

  if (!user || !isEnabledStatus(user.status)) {
    throw new AppError(401, "UNAUTHORIZED", "Your account is unavailable.");
  }

  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    active: true,
  };
}
