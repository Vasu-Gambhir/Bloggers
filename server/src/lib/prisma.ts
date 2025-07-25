import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getPrisma = (dbUrl: string) => {
  const prisma = new PrismaClient({ datasourceUrl: dbUrl }).$extends(
    withAccelerate()
  );
  return prisma;
};
