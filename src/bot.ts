import TelegramBot from "node-telegram-bot-api";
import { readdirSync } from "fs";
import { join } from "path";

// Types
import { CommandExecute, Command } from "./@types/command";

// Handlers
import { messageHandler } from "./events/message";
import { callbackQueryHandler } from "./events/callbackQuery";

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
  const commandName =
    typeof cmd.meta.command === "object"
      ? cmd.meta.command[0]
      : cmd.meta.command;

  if (!cmd.meta.hidden)
    botCommands.push({
      command: commandName,
      description: cmd.meta.description,
    });

  if (typeof cmd.meta.command === "object") {
    for (const command of cmd.meta.command) {
      commands.set(command, cmd.execute);
    }
  } else commands.set(cmd.meta.command, cmd.execute);
}

bot.setMyCommands(botCommands);

bot.on("message", messageHandler);
bot.on("callback_query", callbackQueryHandler);
