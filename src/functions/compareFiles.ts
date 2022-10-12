import consola from "consola";

// Types
import type { NewsOrAnnouncements } from "../@types/news";
import type { IEvent } from "src/@types/events";

// Functions
import { updateCloudRecords } from "./updateCloudRecords";
import { sendForApproval, sendImageForApproval } from "./sendForApproval";
import { getNewsState } from "./getNewsState";

export const compareFiles = async (
  news: NewsOrAnnouncements[],
  events: IEvent[]
) => {
  const result = await getNewsState();
  if (!result.news) return;

  const newNews = news.filter((item) => {
    return !result.news.find(
      (localItem: NewsOrAnnouncements) =>
        localItem.link === item.link || localItem.title === item.title
    );
  });

  const newEvents = events.filter((item) => {
    return !result.events?.find(
      (localItem: IEvent) => localItem.title === item.title
    );
  });

  if (newNews.length <= 0 && newEvents.length <= 0) return;

  if (newNews.length)
    consola.info(
      `[COMPARE] Found ${newNews.length} news, updating the DB and posting for approval.`
    );

  if (newEvents.length)
    consola.info(
      `[COMPARE] Found ${newEvents.length} events, updating the DB and posting for approval.`
    );

  await updateCloudRecords(news, events);

  for (const item of newNews) {
    sendForApproval(
      `${item.type === "announcement" ? "📢" : "📰"} *${item.title}* - ${
        item.date
      }\n\n${item.description}`,
      item.link
    );
  }

  for (const item of newEvents) {
    sendImageForApproval(`✨ *${item.title}*`, item.image, item.link);
  }
};
