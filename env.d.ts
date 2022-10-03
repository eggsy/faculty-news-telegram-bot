import type { APIAuthentication } from "@onehop/js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      HOP_TOKEN: APIAuthentication;
    }
  }
}

export {};
