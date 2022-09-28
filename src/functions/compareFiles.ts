import config from "../config";
import bot from "../structures/Bot";
import { readFileSync } from "fs";

// Types
import type { NewsOrAnnouncements } from "../main";

// Functions
import { updateLocalFile } from "./updateLocalFile";

export const compareFiles = async (news: NewsOrAnnouncements[]) => {
  const localNews: NewsOrAnnouncements[] =
    JSON.parse(readFileSync(`cache/news.json`).toString()) || [];

  const newNews = news.filter((item) => {
    return !localNews.find(
      (localItem: NewsOrAnnouncements) => localItem.link === item.link
    );
  });

  if (newNews.length <= 0) return;

  await updateLocalFile(news);

  for (const item of newNews) {
    bot.sendMessage(
      config.CHANNEL_ID,
      `${item.type === "announcement" ? "📢" : "📰"} *${item.title}* - ${
        item.date
      }\n\n${item.description}`,
      {
        parse_mode: "Markdown",
        disable_notification: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Devamını Oku",
                url: item.link,
              },
            ],
          ],
        },
      }
    );
  }

  return false;
};
