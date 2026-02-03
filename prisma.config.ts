// prisma.config.ts
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";
config(); // Load environment variables
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
