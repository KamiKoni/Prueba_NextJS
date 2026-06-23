import { isEnabledStatus } from "@/lib/constants";
import type { UserDocument } from "@/lib/mongodb";
import type { AuditLogRecord, ScheduleRecord, SessionUser, UserRecord } from "@/types/app";

type UserShape = Pick<UserDocument, "_id" | "name" | "email" | "role" | "status" | "createdAt" | "updatedAt">;
type RelatedUserShape = Pick<UserDocument, "_id" | "name" | "email" | "role" | "status">;

export function serializeSessionUser(user: RelatedUserShape): SessionUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    active: isEnabledStatus(user.status),
  };
}

export function serializeUser(user: UserShape): UserRecord {
  return {
    ...serializeSessionUser(user),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializeSchedule(schedule: ScheduleRecord): ScheduleRecord {
  return schedule;
}

export function serializeAuditLog(log: AuditLogRecord): AuditLogRecord {
  return log;
}
