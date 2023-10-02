import { bot } from "@/bot";
import config from "@/config";

// Types
import type { CommandExecute, CommandMeta } from "@/@types/command";

export const execute: CommandExecute = async (message) => {
  if (message.chat.id !== Number(config.MANAGER_GROUP_ID)) return;

  await bot.sendMessage(
    config.CHANNEL_ID,
    "🔥 *Şubat ayı yemek listesi paylaşıldı ve menü bota eklendi!*\n\nGüncel yemek listesine aşağıdaki butondan ulaşabilirsiniz.",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🍕 Yemek Listesi",
              url: "http://sks.alparslan.edu.tr/files/73/YEMEK%20MEN%C3%9CS%C3%9C/S%CC%A7UBAT%202023-4.pdf",
            },
          ],
          [
            {
              text: "🤖 Bota Sor (/yemek)",
              url: "https://t.me/maun_egitim_bot",
            },
          ],
        ],
      },
    }
  );
};

export const meta: CommandMeta = {
  command: "test",
  description: "Botun test mesajı.",
  hidden: true,
};
