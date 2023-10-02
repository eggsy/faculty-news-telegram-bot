import { bot } from "@/bot";
import dormitories from "@/data/dormitories";

// Types
import type { CommandExecute, CommandMeta } from "@/@types/command";

export const execute: CommandExecute = async (message) => {
  await bot.sendMessage(
    message.chat.id,
    `🏨 Hangi yurdun bilgilerine bakmak istersiniz?`,
    {
      parse_mode: "Markdown",
      disable_notification: true,
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: dormitories.map((item) => [
          {
            text: item.name,
            callback_data: `yurt_${item.id}`,
          },
        ]),
      },
    }
  );
};

export const meta: CommandMeta = {
  command: ["yurt", "kyk", "yurtmenu"],
  description: "Yurtlar menüsünü gönderir.",
};
