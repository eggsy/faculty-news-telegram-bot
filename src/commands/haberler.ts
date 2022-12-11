import { bot } from "../bot";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";
import type { InlineKeyboardButton } from "node-telegram-bot-api";

// Functions
import { fetchNews } from "../functions/fetchNews";

export const execute: CommandExecute = async (message) => {
  const msg = await bot.sendMessage(
    message.chat.id,
    `✨ Haberler alınırken lütfen bekleyin...`
  );

  const news = await fetchNews(true).catch(async () => {
    bot.editMessageText("😔 Haberler alınırken bir hata oluştu.", {
      message_id: msg.message_id,
      chat_id: message.chat.id,
    });
  });

  if (news) {
    const newsButtons: InlineKeyboardButton[] = [];
    const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];

    for (const index in news) {
      const item = news[index];

      newsButtons.push({
        text: numberEmojis[index],
        url: item.link,
      });
    }
    await bot.editMessageText(
      news
        .map(
          (item, index) =>
            `${numberEmojis[index]} *${item.title}* (${item.date})`
        )
        .join("\n\n"),
      {
        message_id: msg.message_id,
        chat_id: message.chat.id,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [...newsButtons.slice(0, 3)],
            [...newsButtons.slice(3, 6)],
            [...newsButtons.slice(6, 8)],
          ],
        },
      }
    );
  }
};

export const meta: CommandMeta = {
  command: "haberler",
  description: "Eğitim fakültesinin sitesindeki son haberleri gönderir.",
};
