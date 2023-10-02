import { bot } from "@/bot";
import menuByDate from "@/data/menuByDate";

// Functions
import { getDayName } from "@/functions/getDayName";

// Types
import type {
  CallbackQuery,
  InlineKeyboardButton,
} from "node-telegram-bot-api";

export const menuHandler = async (data: CallbackQuery) => {
  const menuDate = data.data.split("_")[1];
  const foundMenu = menuByDate.find((item) => item.date === menuDate);

  if (foundMenu) {
    const foundMenuIndex = menuByDate.findIndex(
      (item) => item.date === menuDate
    );

    const previousDayMenu = menuByDate[foundMenuIndex - 1];
    const nextDayMenu = menuByDate[foundMenuIndex + 1];

    const buttons: InlineKeyboardButton[][] = [[]];

    if (previousDayMenu)
      buttons[0].push({
        text: "◀️ Önceki Gün",
        callback_data: `menu_${previousDayMenu.date}`,
      });

    if (nextDayMenu)
      buttons[0].push({
        text: "Sonraki Gün ▶️",
        callback_data: `menu_${nextDayMenu.date}`,
      });

    await bot
      .editMessageText(
        `📅 *${menuDate} ${getDayName(menuDate)}*\n\n${foundMenu.menu
          .map((item, index) => `${getEmojiFromIndex(index)} ${item}`)
          .join("\n")}`,
        {
          chat_id: data.message.chat.id,
          message_id: data.message.message_id,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons,
          },
        }
      )
      .catch(() => {});

    bot.answerCallbackQuery(data.id);
  } else {
    await bot.editMessageText("Seçtiğiniz tarihe ait bir menü bulunamadı.", {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
      parse_mode: "Markdown",
    });

    bot.answerCallbackQuery(data.id, {
      text: "Bu tarihin menüsü sistemde yok.",
    });
  }
};

const getEmojiFromIndex = (index: number) => {
  if (index === 0) return "1️⃣";
  else if (index === 1) return "2️⃣";
  else if (index === 2) return "3️⃣";
  else if (index === 3) return "4️⃣";
  else if (index === 4) return "5️⃣";

  return "🍕";
};
