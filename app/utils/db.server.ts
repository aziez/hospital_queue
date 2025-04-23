import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).__db) {
    (global as any).__db = new PrismaClient();
  }
  prisma = (global as any).__db;
}

export { prisma };
