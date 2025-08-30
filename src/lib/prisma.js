import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (import.meta.env.DEV) globalForPrisma.prisma = prisma;

export default prisma;
