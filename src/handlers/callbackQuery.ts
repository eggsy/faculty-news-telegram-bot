import bot from "../structures/Bot";
import config from "../config";

// Types
import type { NewsOrAnnouncements } from "../@types/news";
import type { CallbackQuery } from "node-telegram-bot-api";

// Functions
import { sendMessageToChannel } from "../functions/sendMessageToChannel";
import { getCurrentTime } from "../functions/getCurrentTime";
import { getNewsState } from "../functions/getNewsState";

export const callbackQueryHandler = async (data: CallbackQuery) => {
  if (data.message?.chat.id !== Number(config.MANAGER_GROUP_ID)) return;
  else if (!data.data) return;

  const newsResponse = await getNewsState();
  if (newsResponse.status !== 200) return;

  const newsData: NewsOrAnnouncements =
    newsResponse.data.data?.state?.news.find(
      (item: NewsOrAnnouncements) => item.link === data.data
    );

  if (!newsData) {
    bot.answerCallbackQuery(data.id, {
      text: "Veritabanında bu haber bulunamadı.",
    });
    return;
  }

  const content = `${newsData.type === "announcement" ? "📢" : "📰"} *${
    newsData.title
  }* - ${newsData.date}\n\n${newsData.description}`;

  await sendMessageToChannel(content, {
    keyboards: [
      {
        text: "Devamını Oku",
        url: newsData.link,
      },
    ],
  });

  await bot.editMessageReplyMarkup(
    {
      inline_keyboard: [],
    },
    {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
    }
  );

  await bot.editMessageText(
    `${content}\n\n－ @${
      data.from.username
    } tarafından *${getCurrentTime()}* tarihinde onaylandı`,
    {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
      parse_mode: "Markdown",
    }
  );

  await bot.answerCallbackQuery(data.id, {
    text: "Haber başarıyla yayınlandı!",
  });
};
