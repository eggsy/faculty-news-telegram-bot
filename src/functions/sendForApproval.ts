import bot from "../structures/Bot";
import config from "../config";

export const sendForApproval = (content: string, newsId: string) => {
  return bot.sendMessage(config.MANAGER_GROUP_ID, content, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "👁 Devamını Oku",
            url: `${newsId}`,
          },
        ],
        [
          {
            text: "✅ Onayla",
            callback_data: newsId,
          },
        ],
      ],
    },
  });
};
