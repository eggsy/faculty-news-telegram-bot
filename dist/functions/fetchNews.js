"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNews = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
// Functions
const compareFiles_1 = require("./compareFiles");
const updateLocalFile_1 = require("./updateLocalFile");
const PAGE_URL = config_1.default.PAGE_URL;
const fetchNews = () => __awaiter(void 0, void 0, void 0, function* () {
    const pages = yield axios_1.default.all([PAGE_URL, `${PAGE_URL}/2`, `${PAGE_URL}/3`].map((url) => axios_1.default.get(url)));
    const root = node_html_parser_1.default(pages.map((page) => page.data).join(""));
    const news = root.querySelectorAll(".news-inner");
    const newsList = news.map((item) => {
        var _a, _b, _c, _d;
        const title = (_a = item.querySelector(".news-details-title")) === null || _a === void 0 ? void 0 : _a.structuredText;
        const description = (_b = item.querySelector(".news-details-description")) === null || _b === void 0 ? void 0 : _b.structuredText;
        const link = (_c = item.querySelector("a:first-child")) === null || _c === void 0 ? void 0 : _c.getAttribute("href");
        const date = (_d = item.querySelector(".news-details-date")) === null || _d === void 0 ? void 0 : _d.structuredText;
        return {
            title: title === null || title === void 0 ? void 0 : title.trim(),
            description: description === null || description === void 0 ? void 0 : description.trim(),
            link: link === null || link === void 0 ? void 0 : link.trim(),
            date: date === null || date === void 0 ? void 0 : date.trim(),
        };
    });
    Promise.all([compareFiles_1.compareFiles(newsList), updateLocalFile_1.updateLocalFile(newsList)]);
    return newsList;
});
exports.fetchNews = fetchNews;
