import { bot } from "../bot";
import config from "../config";

// Types
import type { CommandExecute, CommandMeta } from "../@types/command";

export const execute: CommandExecute = async (message) => {
  bot.sendMessage(message.chat.id, config.YEMEK_IBAN);
};

export const meta: CommandMeta = {
  command: "iban",
  description: "Yemek IBAN'ını gönderir.",
  hidden: true,
};
