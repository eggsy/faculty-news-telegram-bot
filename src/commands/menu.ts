import { bot } from "../bot";
import menuByDate from "../data/menuByDate";
import moment from "moment";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";

export const execute: CommandExecute = async (message) => {
  const tomorrowDate = moment().add(1, "days").format("DD.MM.YYYY");
  const tomorrowIndex = menuByDate.findIndex(
    (item) => item.date === tomorrowDate
  );

  const nextThreeDays = menuByDate.slice(tomorrowIndex, tomorrowIndex + 3);

  await bot.sendMessage(
    message.chat.id,
    `📅 Hangi günün menüsüne bakmak istersiniz?`,
    {
      parse_mode: "Markdown",
      disable_notification: true,
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: [
          [
            {
              text: "▶️ Bugün",
              callback_data: `menu_${moment().format("DD.MM.YYYY")}`,
            },
            {
              text: "⏩ Yarın",
              callback_data: `menu_${tomorrowDate}`,
            },
          ],
          [
            ...nextThreeDays.map((item) => ({
              text: item.date,
              callback_data: `menu_${item.date}`,
            })),
          ],
        ],
      },
    }
  );
};

export const meta: CommandMeta = {
  command: "menu",
  description: "Yemek menüsünü gönderir.",
};
