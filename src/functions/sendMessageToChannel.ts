import { bot } from "@/bot";
import config from "@/config";
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
  } as SendMessageToChannelOptions;

  if (options?.keyboards)
    optionsObject.reply_markup = {
      inline_keyboard: options.keyboards.map((item) => [item]),
    };

  return bot.sendMessage(config.CHANNEL_ID, content, optionsObject);
};
