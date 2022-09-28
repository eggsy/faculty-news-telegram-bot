"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFiles = void 0;
const fs_1 = require("fs");
const Bot_1 = __importDefault(require("../structures/Bot"));
const compareFiles = (news) => {
    const localNews = JSON.parse(fs_1.readFileSync(`cache/news.json`).toString()) || [];
    const newNews = news.filter((item) => {
        return !localNews.find((localItem) => localItem.link === item.link);
    });
    if (newNews.length <= 0)
        return;
    for (const item of newNews) {
        Bot_1.default.sendMessage(944598717, `📢 *${item.title}* - ${item.date}\n\n${item.description}`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Devamını Oku",
                            url: item.link,
                        },
                    ],
                ],
            },
        });
    }
    return false;
};
exports.compareFiles = compareFiles;
