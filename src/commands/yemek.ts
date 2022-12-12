import { bot } from "../bot";
import menuByDate from "../data/menuByDate";
import moment from "moment";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";
import type { InlineKeyboardButton } from "node-telegram-bot-api";

export const execute: CommandExecute = async (message) => {
  const todayDate = moment();
  const tomorrowDate = moment().add(1, "days");

  const todayIndex = menuByDate.findIndex(
    (item) => item.date === todayDate.format("DD.MM.YYYY")
  );
  const tomorrowIndex = menuByDate.findIndex(
    (item) => item.date === tomorrowDate.format("DD.MM.YYYY")
  );

  let nextDayIndex = tomorrowIndex;

  if (tomorrowIndex === -1) {
    const laterDay = tomorrowDate.add(1, "days");

    nextDayIndex = menuByDate.findIndex(
      (item) => item.date === laterDay.format("DD.MM.YYYY")
    );
  }

  if (nextDayIndex === -1) {
    const laterDay = tomorrowDate.add(2, "days");

    nextDayIndex = menuByDate.findIndex(
      (item) => item.date === laterDay.format("DD.MM.YYYY")
    );
  }

  const initialButtons: InlineKeyboardButton[] = [];

  const closestDaysToTomorrow = menuByDate
    .slice(
      tomorrowIndex !== -1 ? nextDayIndex + 1 : nextDayIndex,
      nextDayIndex + 8
    )
    .filter(
      (item) => ![6, 7].includes(moment(item.date, "DD.MM.YYYY").isoWeekday())
    );

  if (todayIndex !== -1 && ![6, 7].includes(todayDate.isoWeekday())) {
    initialButtons.push({
      text: "▶️ Bugün",
      callback_data: `menu_${todayDate.format("DD.MM.YYYY")}`,
    });
  }

  if (tomorrowIndex !== -1 && ![6, 7].includes(tomorrowDate.isoWeekday())) {
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
            ...closestDaysToTomorrow.slice(0, 3).map((item) => ({
              text: item.date,
              callback_data: `menu_${item.date}`,
            })),
          ],
          [
            {
              text: "💳 Karta Para Yükle (IBAN)",
              callback_data: "yemek_iban",
            },
          ],
        ],
      },
    }
  );
};

export const meta: CommandMeta = {
  command: ["yemek", "menu", "yemekmenu"],
  description: "Yemek menüsünü gönderir.",
};
