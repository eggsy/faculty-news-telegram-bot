import { config as loadEnv } from "dotenv";
import { APIAuthentication, Hop } from "@onehop/js";

loadEnv();

const token = process.env.HOP_TOKEN as APIAuthentication | undefined;

if (!token) {
  throw new Error("No hop project token provided");
}

export const hop = new Hop(token);
