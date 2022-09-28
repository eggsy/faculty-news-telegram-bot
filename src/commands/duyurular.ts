import bot from "../structures/Bot";

// Types
import { CommandExecute, CommandMeta } from "../@types/command";

// Functions
import { fetchAnnouncements } from "../functions/fetchAnnouncements";

export const execute: CommandExecute = async (message) => {
  const msg = await bot.sendMessage(
    message.chat.id,
    `✨ Duyurular alınırken lütfen bekleyin...`
  );

  const news = await fetchAnnouncements(true).catch(async () => {
    bot.editMessageText("😔 Duyurular alınırken bir hata oluştu.", {
      message_id: msg.message_id,
      chat_id: message.chat.id,
    });
  });

  if (news)
    await bot.editMessageText(
      news
        .map(
          (item) => `📢 *${item.title}* (${item.date}) - [Oku](${item.link})`
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
  command: "duyurular",
  description: "Eğitim fakültesinin sitesindeki son duyuruları gönderir",
};
