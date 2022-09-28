import axios from "axios";
import parse from "node-html-parser";

// Types
import type { NewsOrAnnouncements } from "../main";

const PAGE_URL = "http://egitimf.alparslan.edu.tr/tr/news-all";

export const fetchNews = async (lessResults: boolean = false) => {
  const pagesToFetch = [PAGE_URL, `${PAGE_URL}/2`];
  if (lessResults === false) pagesToFetch.push(`${PAGE_URL}/3`);

  const pages = await axios
    .all(pagesToFetch.map((url) => axios.get(url)))
    .catch(null);

  const root = parse(pages.map((page) => page.data).join(""));
  const news = root.querySelectorAll(".news-inner");

  const newsList: NewsOrAnnouncements[] = news
    .map((item) => {
      const [title, description, link, date] = [
        item.querySelector(".news-details-title")?.structuredText,
        item.querySelector(".news-details-description")?.structuredText,
        item.querySelector("a:first-child")?.getAttribute("href"),
        item.querySelector(".news-details-date")?.structuredText,
      ];

      return {
        title: title?.trim(),
        description: description?.trim(),
        link: link?.trim(),
        date: date?.trim(),
        type: "news",
      } as NewsOrAnnouncements;
    })
    .filter((item) => Boolean(item.title) && Boolean(item.link));

  return newsList;
};
