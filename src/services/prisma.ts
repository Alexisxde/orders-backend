import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { DATABASE_URL } from "@/config";

const adapter = new PrismaPg({ url: DATABASE_URL });

export default new PrismaClient({ adapter });
