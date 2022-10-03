import bot from "../structures/Bot";
import config from "src/config";
import {
  SendMessageOptions,
  InlineKeyboardButton,
} from "node-telegram-bot-api";

interface SendMessageToChannelOptions extends SendMessageOptions {
  keyboards: InlineKeyboardButton[];
}

export const sendMessageToChannel = (
  content: string,
  options?: SendMessageToChannelOptions
) => {
  const optionsObject: SendMessageToChannelOptions = {
    ...options,
    parse_mode: "Markdown",
    disable_notification: true,
  } as SendMessageToChannelOptions;

  if (options?.keyboards)
    optionsObject.reply_markup = {
      inline_keyboard: options.keyboards.map((item) => [item]),
    };

  bot.sendMessage(config.CHANNEL_ID, content, optionsObject);
};
