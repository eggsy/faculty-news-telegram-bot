import { Message } from "node-telegram-bot-api";

export interface CommandMeta {
  command: string | string[];
  description: string;
  hidden?: boolean;
}

export type CommandExecute = (message: Message, ...args: any) => void;

export interface Command {
  meta: CommandMeta;
  execute: CommandExecute;
}
