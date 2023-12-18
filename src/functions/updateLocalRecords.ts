import { writeFileSync } from "fs";
import { join } from "path";

// Types
import type { NewsOrAnnouncements } from "@/types/news";
import type { IEvent } from "@/types/events";

export const updateLocalRecords = async (
  news: NewsOrAnnouncements[] = [],
  events: IEvent[] = []
) => {
  writeFileSync(
    join(process.cwd(), "./cache", "./maun-news.json"),
    JSON.stringify({ news, events })
  );
};
