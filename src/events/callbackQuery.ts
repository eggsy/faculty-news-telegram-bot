import { bot } from "@/bot";
import config from "@/config";

// Types
import type { NewsOrAnnouncements } from "@/types/news";
import type { CallbackQuery } from "node-telegram-bot-api";

// Functions
import { sendMessageToChannel } from "@/functions/sendMessageToChannel";
import { getCurrentTime } from "@/functions/getCurrentTime";
import { getNewsState } from "@/functions/getNewsState";

// Handlers
import { ibanHandler } from "@/events/handlers/ibanHandler";
import { menuHandler } from "@/events/handlers/menuHandler";
import { dormitoryHandler } from "@/events/handlers/dormitoryHandler";

export const callbackQueryHandler = async (data: CallbackQuery) => {
  /* Custom handlers */
  if (["yemek_iban", "yemek_iban_only"].includes(data.data)) {
    ibanHandler(data);
    return;
  } else if (data.data.startsWith("menu_")) {
    menuHandler(data);
    return;
  } else if (data.data.startsWith("yurt_")) {
    dormitoryHandler(data);
    return;
  }

  if (data.message?.chat.id !== Number(config.MANAGER_GROUP_ID)) return;

  const newsResponse = await getNewsState();
  if (!newsResponse.news) return;

  const newsData: NewsOrAnnouncements | undefined = newsResponse.news.find(
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
