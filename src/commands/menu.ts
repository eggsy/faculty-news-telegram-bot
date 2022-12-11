import { bot } from "../bot";
import menuByDate from "../data/menuByDate";
import moment from "moment";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";
import type { InlineKeyboardButton } from "node-telegram-bot-api";

export const execute: CommandExecute = async (message) => {
  const todayDate = moment();
  const tomorrowDate = moment().add(1, "days");

  const tomorrowIndex = menuByDate.findIndex(
    (item) => item.date === tomorrowDate.format("DD.MM.YYYY")
  );

  const nextThreeDays = menuByDate.slice(tomorrowIndex, tomorrowIndex + 3);
  const initialButtons: InlineKeyboardButton[] = [];

  if (![6, 7].includes(todayDate.isoWeekday())) {
    initialButtons.push({
      text: "▶️ Bugün",
      callback_data: `menu_${todayDate.format("DD.MM.YYYY")}`,
    });
  }

  if (![6, 7].includes(tomorrowDate.isoWeekday())) {
    initialButtons.push({
      text: "⏩ Yarın",
      callback_data: `menu_${tomorrowDate.format("DD.MM.YYYY")}`,
    });
  }

  await bot.sendMessage(
    message.chat.id,
    `📅 Hangi günün yemek menüsüne bakmak istersiniz?`,
    {
      parse_mode: "Markdown",
      disable_notification: true,
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: [
          [...initialButtons],
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
  command: ["menu", "yemek", "yemekmenu"],
  description: "Yemek menüsünü gönderir.",
};
