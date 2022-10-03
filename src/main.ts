import cron from "node-cron";
import { config as loadEnv } from "dotenv";
import { join } from "path";
import { APIAuthentication, Hop } from "@onehop/js";

loadEnv({
  path: join(process.cwd(), ".env.local"),
});

// Functions
import { createDirectoryAndFile } from "./functions/createDirectoryAndFile";
import { fetchAnnouncements } from "./functions/fetchAnnouncements";
import { compareFiles } from "./functions/compareFiles";
import { fetchNews } from "./functions/fetchNews";

const fetchContent = async () => {
  console.info("[CRON] Fetching news...");

  const news = await fetchNews();
  const announcemenets = await fetchAnnouncements();
  await compareFiles([...news, ...announcemenets]);
};

cron.schedule("*/30 * * * *", fetchContent);

const init = async () => {
  createDirectoryAndFile();
  fetchContent();
};

const HopToken = process.env.HOP_TOKEN as APIAuthentication;
export const hop = new Hop(HopToken);

init();
