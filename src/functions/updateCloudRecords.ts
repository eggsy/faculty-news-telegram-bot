import { hop } from "@/hop";

// Types
import type { NewsOrAnnouncements } from "@/types/news";
import type { IEvent } from "@/types/events";

export const updateCloudRecords = async (
  news: NewsOrAnnouncements[] = [],
  events: IEvent[] = []
) => {
  await hop.channels.setState("maun-news", { news, events });
};
