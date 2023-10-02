import { config as loadEnv } from "dotenv";
import consola from "consola";
import { schedule } from "node-cron";

// Functions
import { fetchAnnouncements } from "@/functions/fetchAnnouncements";
import { compareFiles } from "@/functions/compareFiles";
import { fetchNews } from "@/functions/fetchNews";
import { fetchEvents } from "@/functions/fetchEvents";

loadEnv();

const fetchContent = async () => {
  consola.info("[CRON] Fetching news, announcements and events...");

  const news = await fetchNews();
  const announcemenets = await fetchAnnouncements();
  const events = await fetchEvents();

  await compareFiles([...news, ...announcemenets], events);
};

const init = () => {
  fetchContent().catch(consola.error);
  schedule("*/30 * * * *", fetchContent);
};

init();
