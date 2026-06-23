import { AppError } from "@/lib/errors";

export function assertValidScheduleWindow(startAt: Date, endAt: Date) {
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new AppError(400, "INVALID_SCHEDULE", "Schedule dates are invalid.");
  }

  if (startAt >= endAt) {
    throw new AppError(400, "INVALID_SCHEDULE", "The start date must be earlier than the end date.");
  }
}
