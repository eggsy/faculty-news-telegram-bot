import { config as loadEnv } from "dotenv";
import consola from "consola";
import { schedule } from "node-cron";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Functions
import { fetchAnnouncements } from "@/functions/fetchAnnouncements";
import { compareFiles } from "@/functions/compareFiles";
import { fetchNews } from "@/functions/fetchNews";
import { fetchEvents } from "@/functions/fetchEvents";

loadEnv();

const fetchContent = async () => {
  consola.info("[CRON] Fetching news, announcements and events...");

  try {
    const news = await fetchNews();
    const announcemenets = await fetchAnnouncements();
    const events = await fetchEvents();

    await compareFiles([...news, ...announcemenets], events);
  } catch (_) {
    console.error(_);
    consola.error(
      "[CRON] An error occured while fetching news, announcements and events."
    );
  }
};

const init = () => {
  if (!existsSync(join(process.cwd(), "./cache"))) {
    consola.info("[INIT] Creating cache folder...");
    mkdirSync(join(process.cwd(), "./cache"));
  }

  if (!existsSync(join(process.cwd(), "./cache", "./maun-news.json"))) {
    consola.info("[INIT] Creating maun-news.json file...");
    writeFileSync(
      join(process.cwd(), "./cache", "./maun-news.json"),
      JSON.stringify({ news: [], events: [] })
    );
  }

  // Only fetch content in production
  if (process.env.NODE_ENV !== "production") return;

  fetchContent().catch(consola.error);
  schedule("*/30 * * * *", fetchContent);
};

init();
