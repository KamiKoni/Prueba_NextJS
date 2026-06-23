import { ObjectId } from "mongodb";

import { getCollections, toObjectId } from "@/lib/mongodb";

export async function createRefreshSession(params: {
  userId: ObjectId;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const { refreshTokens } = await getCollections();
  const session = {
    _id: new ObjectId(),
    userId: params.userId,
    tokenHash: "pending",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
    createdAt: new Date(),
  };

  await refreshTokens.insertOne(session);
  return session;
}

export async function updateRefreshTokenHash(sessionId: ObjectId, tokenHash: string) {
  const { refreshTokens } = await getCollections();
  await refreshTokens.updateOne({ _id: sessionId }, { $set: { tokenHash } });
}

export async function findRefreshSession(sessionId: string) {
  const id = toObjectId(sessionId);

  if (!id) {
    return null;
  }

  const { refreshTokens } = await getCollections();
  return refreshTokens.findOne({ _id: id });
}

export async function rotateRefreshSession(currentId: ObjectId, replacementId: ObjectId, tokenHash: string) {
  const { refreshTokens } = await getCollections();

  await Promise.all([
    refreshTokens.updateOne(
      { _id: currentId },
      { $set: { revokedAt: new Date(), replacedByTokenId: replacementId } },
    ),
    refreshTokens.updateOne({ _id: replacementId }, { $set: { tokenHash } }),
  ]);
}

export async function revokeRefreshSession(sessionId: string) {
  const id = toObjectId(sessionId);

  if (!id) {
    return;
  }

  const { refreshTokens } = await getCollections();
  await refreshTokens.updateOne(
    { _id: id, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}
