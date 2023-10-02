import { defineConfig } from "tsup";
import { config as loadEnv } from "dotenv";

loadEnv();

export default defineConfig({
  entry: ["src/**/**.ts"],
  splitting: false,
  sourcemap: true,
  clean: false,
  env: process.env as Record<string, string>,
});
