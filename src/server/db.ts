import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const createPrismaClient = () => {
  const url = env.DATABASE_URL;

  // Use libSQL adapter for Turso URLs
  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    const adapter = new PrismaLibSql({
      url: url,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    return new PrismaClient({
      adapter,
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  // Use standard client for local file URLs
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
