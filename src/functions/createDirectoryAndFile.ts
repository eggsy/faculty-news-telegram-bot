import { existsSync, writeFileSync, mkdirSync } from "fs";

export const createDirectoryAndFile = (reset = false) => {
  if (!existsSync("cache")) {
    mkdirSync("cache");
  }

  if (reset === true || !existsSync("cache/news.json")) {
    writeFileSync(`cache/news.json`, "[]");
  }
};
