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
