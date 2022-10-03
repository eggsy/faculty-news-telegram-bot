import consola from "consola";

// Types
import type { NewsOrAnnouncements } from "../@types/news";

// Functions
import { updateCloudRecords } from "./updateCloudRecords";
import { sendForApproval } from "./sendForApproval";
import { getNewsState } from "./getNewsState";

export const compareFiles = async (news: NewsOrAnnouncements[]) => {
  const result = await getNewsState();
  if (!result.news) return;

  const newNews = news.filter((item) => {
    return !result.news.find(
      (localItem: NewsOrAnnouncements) =>
        localItem.link === item.link || localItem.title === item.title
    );
  });

  if (newNews.length <= 0) return;

  consola.info(
    `[COMPARE] Found ${newNews.length} news, updating the DB and posting for approval.`
  );

  await updateCloudRecords(news);

  for (const item of newNews) {
    sendForApproval(
      `${item.type === "announcement" ? "📢" : "📰"} *${item.title}* - ${
        item.date
      }\n\n${item.description}`,
      item.link
    );
  }
};
