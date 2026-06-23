import { ObjectId } from "mongodb";

import { getCollections, toObjectId } from "@/lib/mongodb";

export async function createAuditLog(params: {
  actorId?: string | ObjectId | null;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: unknown;
}) {
  const { auditLogs } = await getCollections();
  const actorId =
    typeof params.actorId === "string" ? toObjectId(params.actorId) : params.actorId ?? null;

  return auditLogs.insertOne({
    _id: new ObjectId(),
    actorId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    description: params.description,
    metadata: params.metadata,
    createdAt: new Date(),
  });
}

export async function listRecentAuditLogs(limit = 20) {
  const { auditLogs } = await getCollections();
  return auditLogs.find().sort({ createdAt: -1 }).limit(limit).toArray();
}
