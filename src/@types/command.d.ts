import { Message } from "node-telegram-bot-api";

export interface CommandMeta {
  command: string;
  description: string;
  hidden?: boolean;
}

export type CommandExecute = (message: Message) => void;

export interface Command {
  meta: CommandMeta;
  execute: CommandExecute;
}
