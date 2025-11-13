pnpm create next-app@latest nextjs-shadcn-ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button
pnpm add next-themes

pnpm add prisma @prisma/client
pnpm add -D typescript ts-node @types/node
npx prisma init
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase?schema=public"

pnpm add dotenv

crée lib/prisma.ts
rajoute :
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
globalForPrisma.prisma ??
new PrismaClient({
log: ["query", "info", "warn", "error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config(); // charge les variables depuis .env

// prisma.config.ts

import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config(); // charge les variables depuis .env

export default defineConfig({
schema: "prisma/schema.prisma",
migrations: {
path: "prisma/migrations",
},
engine: "classic",
datasource: {
url: env("DATABASE_URL"),
},
});

npx prisma migrate dev --name init

pnpm add @tanstack/react-query
pnpm add lucide-react
pnpm add react-hot-toast

pnpm add bcryptjs jsonwebtoken
pnpm add -D @types/jsonwebtoken<!-- pnpm add yup -->
pnpm add formik yup @hookform/resolvers yup-locales
