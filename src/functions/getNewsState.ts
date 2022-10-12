import { hop } from "../hop";

// Types
import type { IEvent } from "src/@types/events";
import type { NewsOrAnnouncements } from "../@types/news";

export const getNewsState = async () => {
  return (await hop.channels.get("maun-news")).state as {
    news: NewsOrAnnouncements[];
    events: IEvent[];
  };
};
