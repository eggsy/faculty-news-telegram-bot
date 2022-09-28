import bot from "../structures/Bot";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";

export const execute: CommandExecute = async (message) => {
  bot.sendMessage(
    message.chat.id,
    "👋 Merhaba! Ben fakültemiz için yapılmış bir Telegram botuyum. Görevim, fakültemizin sitesine girilen duyuruları en hızlı şekilde sizlere ulaştırmaktır. Komutlarımı görmek için sohbet kısmındaki menüyü inceleyebilirsiniz."
  );
};

export const meta: CommandMeta = {
  command: "start",
  description: "Botun merhaba mesajı.",
};
