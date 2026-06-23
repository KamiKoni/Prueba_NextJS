import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import { fail, ok, parseBody } from "@/lib/api";
import { sendGreetingEmail } from "@/lib/email";
import { AppError } from "@/lib/errors";
import { registerSchema } from "@/lib/schemas";
import { serializeUser } from "@/lib/serializers";
import { createAuditLog } from "@/services/audit-service";
import { createUser, findUserByEmail } from "@/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const payload = await parseBody(request, registerSchema);
    const email = payload.email.toLowerCase();
    const existing = await findUserByEmail(email);

    if (existing) {
      throw new AppError(409, "EMAIL_TAKEN", "Email is already in use.");
    }

    const user = await createUser({
      name: payload.name,
      email,
      passwordHash: await bcrypt.hash(payload.password, 12),
      role: payload.role ?? "EMPLOYEE",
      status: payload.status ?? "ACTIVE",
    });

    await createAuditLog({
      actorId: user._id,
      action: "USER_CREATED",
      entityType: "user",
      entityId: user._id.toHexString(),
      description: `${user.email} registered.`,
      metadata: { role: user.role, status: user.status },
    });

    await sendGreetingEmail({ to: user.email, name: user.name }).catch((error: unknown) => {
      console.error("Greeting email failed", error);
    });

    return ok({ user: serializeUser(user) }, 201);
  } catch (error) {
    return fail(error);
  }
}
