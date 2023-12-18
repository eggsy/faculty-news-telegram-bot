import { readFileSync } from "fs";
import { join } from "path";

// Types
import type { NewsOrAnnouncements } from "@/types/news";
import type { IEvent } from "@/types/events";

export const getNewsState = async () => {
  return JSON.parse(
    readFileSync(join(process.cwd(), "./cache", "./maun-news.json"), "utf-8") ??
      "{}"
  ) as {
    news: NewsOrAnnouncements[];
    events: IEvent[];
  };
};
