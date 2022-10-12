import { config as loadEnv } from "dotenv";
import { join } from "path";

import consola from "consola";
import cron from "node-cron";

loadEnv({
  path: join(process.cwd(), ".env.local"),
});

// Functions
import { fetchAnnouncements } from "./functions/fetchAnnouncements";
import { compareFiles } from "./functions/compareFiles";
import { fetchNews } from "./functions/fetchNews";
import { fetchEvents } from "./functions/fetchEvents";

const fetchContent = async () => {
  consola.info("[CRON] Fetching news, announcements and events...");

  const news = await fetchNews();
  const announcemenets = await fetchAnnouncements();
  const events = await fetchEvents();

  await compareFiles([...news, ...announcemenets], events);
};

cron.schedule("*/30 * * * *", fetchContent);

const init = async () => {
  fetchContent();
};

init();
