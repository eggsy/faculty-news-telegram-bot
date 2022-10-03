import { NewsOrAnnouncements } from "../@types/news";
import { hop } from "../hop";

export const getNewsState = async () => {
  return (await hop.channels.get("maun-news")).state as {
    news: NewsOrAnnouncements[];
  };
};
