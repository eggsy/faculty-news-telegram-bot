import { bot } from "../bot";
import config from "../config";
import menuByDate from "../data/menuByDate";

// Types
import type { NewsOrAnnouncements } from "../@types/news";
import type {
  CallbackQuery,
  InlineKeyboardButton,
} from "node-telegram-bot-api";

// Functions
import { sendMessageToChannel } from "../functions/sendMessageToChannel";
import { getCurrentTime } from "../functions/getCurrentTime";
import { getNewsState } from "../functions/getNewsState";
import { getDayName } from "../functions/getDayName";

export const callbackQueryHandler = async (data: CallbackQuery) => {
  if (["yemek_iban", "yemek_iban_only"].includes(data.data)) {
    if (data.data === "yemek_iban")
      await bot
        .editMessageText(
          `🏷️ *Alıcı:* Muş Alparslan Üniversitesi\n🏦 *Banka:* TC Ziraat Bankası (Muş Şubesi)\n📝 *IBAN*: ${config.YEMEK_IBAN}\n\n☎️ *Hata & Görüş:* sks@alparslan.edu.tr\n⚠️ *Dikkat*: Kendinize ait olmayan bir karttan para gönderirken açıklamaya TC kimlik numaranızı girmeyi unutmayın.`,
          {
            chat_id: data.message.chat.id,
            message_id: data.message.message_id,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "✅ Sadece IBAN'ı Göster",
                    callback_data: "yemek_iban_only",
                  },
                ],
                [
                  {
                    text: "💳 Bakiye Sorgu",
                    url: "http://hesap.alparslan.edu.tr//hesap.aspx",
                  },
                ],
              ],
            },
          }
        )
        .catch(() => {});
    else if (data.data === "yemek_iban_only")
      await bot
        .editMessageText(config.YEMEK_IBAN, {
          chat_id: data.message.chat.id,
          message_id: data.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "◀️ Diğer Bilgileri Göster",
                  callback_data: "yemek_iban",
                },
              ],
            ],
          },
        })
        .catch(() => {});

    bot.answerCallbackQuery(data.id);
    return;
  }

  if (data.data.startsWith("menu_")) {
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

    return;
  }

  if (data.message?.chat.id !== Number(config.MANAGER_GROUP_ID)) return;

  const newsResponse = await getNewsState();
  if (!newsResponse.news) return;

  const newsData: NewsOrAnnouncements | undefined = newsResponse.news.find(
    (item: NewsOrAnnouncements) => item.link === data.data
  );

  if (!newsData) {
    bot.answerCallbackQuery(data.id, {
      text: "Veritabanında bu haber bulunamadı.",
    });
    return;
  }

  const content = `${newsData.type === "announcement" ? "📢" : "📰"} *${
    newsData.title
  }* - ${newsData.date}\n\n${newsData.description}`;

  await sendMessageToChannel(content, {
    keyboards: [
      {
        text: "Devamını Oku",
        url: newsData.link,
      },
    ],
  });

  await bot.editMessageReplyMarkup(
    {
      inline_keyboard: [],
    },
    {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
    }
  );

  await bot.editMessageText(
    `${content}\n\n－ @${
      data.from.username
    } tarafından *${getCurrentTime()}* tarihinde onaylandı`,
    {
      chat_id: data.message.chat.id,
      message_id: data.message.message_id,
      parse_mode: "Markdown",
    }
  );

  await bot.answerCallbackQuery(data.id, {
    text: "Haber başarıyla yayınlandı!",
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
