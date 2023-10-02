import { bot } from "@/bot";
import { dormitories } from "@/data/dormitories";

// Types
import type { CallbackQuery } from "node-telegram-bot-api";

export const dormitoryHandler = async (data: CallbackQuery) => {
  const dormitoryId = data.data.split("_")[1];
  const dormitory = dormitories.find((item) => item.id === dormitoryId);

  if (dormitory) {
    await bot
      .editMessageText(
        `*${dormitory.name}*\n\n📞 ${dormitory.contact.tel}\n📍 ${dormitory.contact.address}`,
        {
          chat_id: data.message.chat.id,
          message_id: data.message.message_id,
          parse_mode: "Markdown",
        }
      )
      .catch(() => {});

    bot.answerCallbackQuery(data.id);
  } else {
    await bot.editMessageText("Seçtiğiniz yurt bulunamadı.", {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
      parse_mode: "Markdown",
    });

    bot.answerCallbackQuery(data.id, {
      text: "Yurt bulunamadı.",
    });
  }
};
