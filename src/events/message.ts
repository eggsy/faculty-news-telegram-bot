import { commands } from "../bot";

// Types
import type { Message } from "node-telegram-bot-api";

export const messageHandler = async (message: Message) => {
  if (!message.text?.startsWith("/")) return;

  const initial = message.text?.split(" ")?.[0]?.split("@maun_egitim_bot")?.[0];
  const command = initial?.slice(1, initial.length);

  commands.get(command)?.(message);
};
