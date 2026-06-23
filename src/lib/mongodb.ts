import { MongoClient, ObjectId, type Db } from "mongodb";

import { getEnv } from "@/lib/env";
import type { AppRole, UserStatus } from "@/lib/constants";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  status: UserStatus;
  favoriteRecipeSlugs?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenDocument {
  _id: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByTokenId?: ObjectId | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
}

export interface RecipeDocument {
  _id: ObjectId;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Chef";
  tags: string[];
  ingredients: string[];
  steps: string[];
  chefTip: string;
  internalNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogDocument {
  _id: ObjectId;
  actorId: ObjectId | null;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: unknown;
  createdAt: Date;
}

export async function getMongoClient() {
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(getEnv().MONGO_URI).connect();
  }

  return globalForMongo.mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getEnv().MONGO_DB_NAME);
}

export async function getCollections() {
  const db = await getDb();

  return {
    users: db.collection<UserDocument>("users"),
    refreshTokens: db.collection<RefreshTokenDocument>("refreshTokens"),
    recipes: db.collection<RecipeDocument>("recipes"),
    auditLogs: db.collection<AuditLogDocument>("auditLogs"),
  };
}

export function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}
