import TelegramBot from "node-telegram-bot-api";
import { readdirSync } from "fs";
import { join } from "path";

// Types
import { CommandExecute, Command } from "../@types/command";

// Handlers
import { messageHandler } from "../handlers/message";
import { callbackQueryHandler } from "../handlers/callbackQuery";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is not defined.");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

export const commands: Map<string, CommandExecute> = new Map();

const files = readdirSync(join(__dirname, "../commands"));
const botCommands = [];

for (const file of files) {
  const cmd = require(join(__dirname, `../commands/${file}`)) as Command;

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

export default bot;
