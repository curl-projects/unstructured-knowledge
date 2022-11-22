import { PrismaClient } from "@prisma/client";

let db: PrismaClient;
let g = global as any

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!g.__db) {
    g.__db = new PrismaClient();
    g.__db.$connect();
  }
  db = g.__db;
}

export { db };
