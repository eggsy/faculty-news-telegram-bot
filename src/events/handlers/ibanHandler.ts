import { bot } from "../../bot";
import config from "../../config";

// Types
import type { CallbackQuery } from "node-telegram-bot-api";

export const ibanHandler = async (data: CallbackQuery) => {
  if (!data.message) return;

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
};
