declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      HOP_TOKEN: string;
      NODE_ENV: "production" | "development";
    }
  }
}

export {};
