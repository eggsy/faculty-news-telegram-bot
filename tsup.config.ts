import { defineConfig } from "tsup";
import { config as loadEnv } from "dotenv";
import { join } from "path";

loadEnv({
  path: join(process.cwd(), ".env"),
});

export default defineConfig({
  entry: ["src/**.ts"],
  splitting: false,
  sourcemap: true,
  clean: false,
  env: process.env as Record<string, string>,
});
