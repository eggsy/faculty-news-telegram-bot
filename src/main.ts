import cron from "node-cron";
import { compareFiles } from "./functions/compareFiles";

// Functions
import { createDirectoryAndFile } from "./functions/createDirectoryAndFile";
import { fetchAnnouncements } from "./functions/fetchAnnouncements";
import { fetchNews } from "./functions/fetchNews";

export interface NewsOrAnnouncements {
  title: string;
  description: string;
  link: string;
  date: string;
  type?: "news" | "announcement";
}

const init = async () => {
  createDirectoryAndFile();
};

cron.schedule("*/30 * * * *", async () => {
  console.info("[CRON] Fetching news...");

  const news = await fetchNews();
  const announcemenets = await fetchAnnouncements();
  await compareFiles([...news, ...announcemenets]);
});

init();
