import { APIAuthentication, Hop } from "@onehop/js";

const token = process.env.HOP_PROJECT_TOKEN as APIAuthentication | undefined;

if (!token) {
	throw new Error("No hop project token provided");
}

export const hop = new Hop(token);
