const DEV_DEFAULTS = {
  MONGO_URI: "mongodb://127.0.0.1:27017",
  JWT_ACCESS_SECRET: "dev-only-jwt-access-secret-32chars!!",
  JWT_REFRESH_SECRET: "dev-only-jwt-refresh-secret-32chars!!",
} as const;

export interface AppEnv {
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  SMTP_HOST?: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

let cachedEnv: AppEnv | null = null;

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return value === "true" || value === "1";
}

function required(name: keyof typeof DEV_DEFAULTS, value: string | undefined) {
  const trimmed = value?.trim();
  if (trimmed) {
    return trimmed;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and set your values.`
    );
  }

  return DEV_DEFAULTS[name];
}

export function getEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = {
      MONGO_URI: required("MONGO_URI", process.env.MONGO_URI),
      MONGO_DB_NAME: process.env.MONGO_DB_NAME?.trim() || "pantry_routes",
      JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET),
      JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET", process.env.JWT_REFRESH_SECRET),
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN?.trim() || "15m",
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN?.trim() || "7d",
      SMTP_HOST: process.env.SMTP_HOST?.trim(),
      SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
      SMTP_SECURE: readBoolean(process.env.SMTP_SECURE, false),
      SMTP_USER: process.env.SMTP_USER?.trim(),
      SMTP_PASS: process.env.SMTP_PASS?.trim(),
      SMTP_FROM: process.env.SMTP_FROM?.trim(),
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
    };
  }

  return cachedEnv;
}
