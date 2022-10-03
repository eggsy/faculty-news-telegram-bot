import { hop } from "../hop";
import type { NewsOrAnnouncements } from "../@types/news";

export const updateCloudRecords = async (news: NewsOrAnnouncements[]) => {
  await hop.channels.setState("maun-news", { news });
};
