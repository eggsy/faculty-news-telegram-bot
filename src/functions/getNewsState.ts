import { hop } from "@/hop";

// Types
import type { NewsOrAnnouncements } from "@/types/news";
import type { IEvent } from "@/types/events";

export const getNewsState = async () => {
  return (await hop.channels.get("maun-news")).state as {
    news: NewsOrAnnouncements[];
    events: IEvent[];
  };
};
