import { bot } from "../bot";

// Types
import { CommandExecute, CommandMeta } from "../@types/command";

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

  if (news)
    await bot.editMessageText(
      news
        .map(
          (item) => `📰 *${item.title}* (${item.date}) - [Oku](${item.link})`
        )
        .join("\n\n"),
      {
        message_id: msg.message_id,
        chat_id: message.chat.id,
        parse_mode: "Markdown",
      }
    );
};

export const meta: CommandMeta = {
  command: "haberler",
  description: "Eğitim fakültesinin sitesindeki son haberleri gönderir.",
};
