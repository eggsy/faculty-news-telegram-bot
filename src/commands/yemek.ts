import { bot } from "@/bot";
import menuByDate from "@/data/menuByDate";
import {
  startOfToday,
  startOfTomorrow,
  format,
  addDays,
  getWeek,
  parse,
} from "date-fns";

// Types
import type { CommandExecute, CommandMeta } from "@/types/command";
import type { InlineKeyboardButton } from "node-telegram-bot-api";

export const execute: CommandExecute = async (message) => {
  const todayDate = startOfToday();
  const tomorrowDate = startOfTomorrow();

  const formattedTodayDate = format(todayDate, "dd.MM.yyyy");
  const formattedTomorrowDate = format(tomorrowDate, "dd.MM.yyyy");

  const todayIndex = menuByDate.findIndex(
    (item) => item.date === formattedTodayDate
  );

  const tomorrowIndex = menuByDate.findIndex(
    (item) => item.date === formattedTomorrowDate
  );

  let nextDayIndex = tomorrowIndex;

  if (tomorrowIndex === -1) {
    nextDayIndex = menuByDate.findIndex(
      (item) => item.date === format(addDays(tomorrowDate, 1), "dd.MM.yyyy")
    );
  }

  if (nextDayIndex === -1) {
    nextDayIndex = menuByDate.findIndex(
      (item) => item.date === format(addDays(tomorrowDate, 2), "dd.MM.yyyy")
    );
  }

  const initialButtons: InlineKeyboardButton[] = [];

  const closestDaysToTomorrow = menuByDate
    .slice(
      tomorrowIndex !== -1 ? nextDayIndex + 1 : nextDayIndex,
      nextDayIndex + 8
    )
    .filter(
      (item) =>
        ![6, 7].includes(getWeek(parse(item.date, "dd.MM.yyyy", new Date())))
    );

  if (todayIndex !== -1 && ![6, 7].includes(getWeek(todayDate))) {
    initialButtons.push({
      text: "▶️ Bugün",
      callback_data: `menu_${formattedTodayDate}`,
    });
  }

  if (tomorrowIndex !== -1 && ![6, 7].includes(getWeek(tomorrowDate))) {
    initialButtons.push({
      text: "⏩ Yarın",
      callback_data: `menu_${formattedTomorrowDate}`,
    });
  }

  if (initialButtons.length === 0 && closestDaysToTomorrow.length === 0) {
    return await bot.sendMessage(
      message.chat.id,
      `📅 Bu ayın yemek menüsü henüz sisteme girilmemiş, lütfen daha sonra tekrar deneyin veya her ay otomatik güncelleme desteği olan MAUN Mobil'i indirin.`,
      {
        parse_mode: "Markdown",
        disable_notification: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 iOS",
                url: "https://apps.apple.com/app/maun-mobile/id6473739177",
              },
            ],
            [
              {
                text: "📱 Android",
                url: "https://play.google.com/store/apps/details?id=com.maun.mobile",
              },
            ],
          ],
        },
      }
    );
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
