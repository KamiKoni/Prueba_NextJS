import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { listRecentAuditLogs } from "@/services/audit-service";

export async function GET(request: NextRequest) {
  try {
    await requireSession(request);
    const logs = await listRecentAuditLogs(20);

    return ok({
      auditLogs: logs.map((log) => ({
        id: log._id.toHexString(),
        actorId: log.actorId?.toHexString() ?? null,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        description: log.description,
        metadata: log.metadata ?? null,
        createdAt: log.createdAt.toISOString(),
        actor: null,
      })),
    });
  } catch (error) {
    return fail(error);
  }
}
