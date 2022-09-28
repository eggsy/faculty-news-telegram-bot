import { writeFileSync } from "fs";
import type { NewsOrAnnouncements } from "../main";

export const updateLocalFile = async (news: NewsOrAnnouncements[]) => {
  const newsListString = JSON.stringify(news);
  writeFileSync(`cache/news.json`, newsListString);
};
