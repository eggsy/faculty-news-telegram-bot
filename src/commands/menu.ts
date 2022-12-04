import { bot } from "../bot";
import menuByDate from "../data/menuByDate";
import moment from "moment";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";

export const execute: CommandExecute = async (message) => {
  const todayMenu = menuByDate.find(
    (item) => item.date === moment().format("DD.MM.YYYY")
  );

  const tomorrowMenu = menuByDate.find(
    (item) => item.date === moment().add(1, "days").format("DD.MM.YYYY")
  );

  const msg = await bot.sendMessage(
    message.chat.id,
    `🍽️ Hangi günün menüsüne bakmak istersiniz?`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        force_reply: true,
      },
    }
  );

  await bot.sendMessage(message.chat.id, `Listeden bir gün seçin:`, {
    parse_mode: "Markdown",
    disable_notification: true,
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "▶️ Bugün",
          },
          {
            text: "⏩ Yarın",
          },
        ],
        [
          ...menuByDate.slice(2, 5).map((item, index) => ({
            text: item.date,
          })),
        ],
      ],
    },
  });

  bot.onReplyToMessage(message.chat.id, msg.message_id, (newMsg) => {
    if (newMsg.text === "▶️ Bugün") {
      if (!todayMenu)
        bot.sendMessage(
          message.chat.id,
          "🍽️ Bugün için belirlenmiş bir menü yok."
        );
      else
        bot.sendMessage(
          message.chat.id,
          `🍽️ *Bugünün menüsü:*\n\n${todayMenu.menu
            .map((item, index) => `${getEmojiFromIndex(index)} ${item}`)
            .join("\n")}`,
          {
            parse_mode: "Markdown",
          }
        );
    } else if (newMsg.text === "⏩ Yarın") {
      if (!tomorrowMenu)
        bot.sendMessage(
          message.chat.id,
          "🍽️ Yarın için belirlenmiş bir menü yok."
        );
      else
        bot.sendMessage(
          message.chat.id,
          `🍽️ *Yarının menüsü:*\n\n${tomorrowMenu.menu
            .map((item, index) => `${getEmojiFromIndex(index)} ${item}`)
            .join("\n")}`,
          {
            parse_mode: "Markdown",
          }
        );
    } else {
      const menu = menuByDate.find((item) => item.date === newMsg.text);

      if (!menu)
        bot.sendMessage(
          message.chat.id,
          "🍽️ Seçtiğiniz tarih için belirlenmiş bir menü yok."
        );
      else
        bot.sendMessage(
          message.chat.id,
          `🍽️ *${menu.date} tarihli menü:*\n\n${menu.menu
            .map((item, index) => `${getEmojiFromIndex(index)} ${item}`)
            .join("\n")}`,
          {
            parse_mode: "Markdown",
          }
        );
    }
  });
};

const getEmojiFromIndex = (index: number) => {
  if (index === 0) return "1️⃣";
  else if (index === 1) return "2️⃣";
  else if (index === 2) return "3️⃣";
  else if (index === 3) return "4️⃣";
  else if (index === 4) return "5️⃣";

  return "🍕";
};

export const meta: CommandMeta = {
  command: "menu",
  description: "Yemek menüsünü gönderir.",
};
