import TelegramBot from "node-telegram-bot-api";
import { readdirSync } from "fs";
import { join } from "path";

// Types
import { CommandExecute, Command } from "./@types/command";

// Handlers
import { messageHandler } from "./handlers/message";
import { callbackQueryHandler } from "./handlers/callbackQuery";

const token =
  process.env.NODE_ENV === "production"
    ? process.env.BOT_TOKEN
    : process.env.BOT_TOKEN_DEV;

if (!token) throw new Error("BOT_TOKEN or BOT_TOKEN_DEV is not defined.");

export const bot = new TelegramBot(token, {
  polling: true,
});

export const commands: Map<string, CommandExecute> = new Map();

const files = readdirSync(join(__dirname, "./commands"));
const botCommands = [];

for (const file of files) {
  const cmd = require(join(__dirname, `./commands/${file}`)) as Command;

  if (!cmd.meta.hidden)
    botCommands.push({
      command: cmd.meta.command,
      description: cmd.meta.description,
    });

  commands.set(cmd.meta.command, cmd.execute);
}

bot.setMyCommands(botCommands);

bot.on("message", messageHandler);
bot.on("callback_query", callbackQueryHandler);
