"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectoryAndFile = void 0;
const fs_1 = require("fs");
const createDirectoryAndFile = (reset = false) => {
    if (!fs_1.existsSync("cache")) {
        fs_1.mkdirSync("cache");
    }
    if (reset === true || !fs_1.existsSync("cache/news.json")) {
        fs_1.writeFileSync(`cache/news.json`, "[]");
    }
};
exports.createDirectoryAndFile = createDirectoryAndFile;
