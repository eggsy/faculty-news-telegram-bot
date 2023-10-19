import axios from "@axios";
import parse from "node-html-parser";

// Types
import type { NewsOrAnnouncements } from "@/types/news";

const PAGE_URL = "http://egitimf.alparslan.edu.tr/tr/announcements-all";

export const fetchAnnouncements = async (lessResults: boolean = false) => {
  const pagesToFetch = [PAGE_URL, `${PAGE_URL}/2`];
  if (lessResults === false) pagesToFetch.push(`${PAGE_URL}/3`);

  const pages = await Promise.all(pagesToFetch.map((url) => axios.get(url)));

  const root = parse(pages.map((page) => page.data).join(""));
  const announcements = root.querySelectorAll(".announcements-inner");

  const announcementsList: NewsOrAnnouncements[] = announcements
    .map((item) => {
      const [title, description, link, date] = [
        item.querySelector(".announcements-details-title")?.structuredText,
        item.querySelector(".announcements-details-description")
          ?.structuredText,
        item.querySelector("a:first-child")?.getAttribute("href"),
        item.querySelector(".announcements-details-date p")?.structuredText,
      ];

      return {
        title: title?.trim(),
        description: description?.trim(),
        link: link?.trim(),
        date: date?.trim(),
        type: "announcement",
      } as NewsOrAnnouncements;
    })
    .filter((item) => Boolean(item.title) && Boolean(item.link));

  return announcementsList;
};
