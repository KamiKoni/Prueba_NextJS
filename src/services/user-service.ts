import { ObjectId } from "mongodb";

import { getCollections, toObjectId, type UserDocument } from "@/lib/mongodb";
import type { AppRole, UserStatus } from "@/lib/constants";
import { serializeSessionUser } from "@/lib/serializers";
import type { SessionUser } from "@/types/app";

export async function findUserByEmail(email: string) {
  const { users } = await getCollections();
  return users.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string | ObjectId) {
  const userId = typeof id === "string" ? toObjectId(id) : id;

  if (!userId) {
    return null;
  }

  const { users } = await getCollections();
  return users.findOne({ _id: userId });
}

export async function countUsers() {
  const { users } = await getCollections();
  return users.countDocuments();
}

export async function createUser(params: {
  name: string;
  email: string;
  passwordHash: string;
  role?: AppRole;
  status?: UserStatus;
}) {
  const { users } = await getCollections();
  const now = new Date();
  const user: UserDocument = {
    _id: new ObjectId(),
    name: params.name,
    email: params.email.toLowerCase(),
    passwordHash: params.passwordHash,
    role: params.role ?? "EMPLOYEE",
    status: params.status ?? "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  await users.insertOne(user);
  return user;
}

export async function getSessionUser(id: string): Promise<SessionUser | null> {
  const user = await findUserById(id);
  return user ? serializeSessionUser(user) : null;
}

export async function getFavoriteSlugs(userId: string) {
  const { favorites } = await getCollections();
  const id = toObjectId(userId);
  if (!id) {
    return [];
  }
  const docs = await favorites.find({ userId: id }).toArray();
  return docs.map((doc) => doc.recipeSlug);
}

export async function setFavoriteSlug(userId: string, slug: string, favorite: boolean) {
  const { favorites } = await getCollections();
  const id = toObjectId(userId);

  if (!id) {
    return [];
  }

  if (favorite) {
    await favorites.updateOne(
      { userId: id, recipeSlug: slug },
      { $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  } else {
    await favorites.deleteOne({ userId: id, recipeSlug: slug });
  }

  return getFavoriteSlugs(userId);
}
