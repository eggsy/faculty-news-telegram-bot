import axios from "axios";
import parse from "node-html-parser";
import { Agent } from "https";

// Types
import type { IEvent } from "../@types/events";

const PAGE_URL = "https://www.alparslan.edu.tr/tr/page/event";

export const fetchEvents = async () => {
  const page = (
    await axios(PAGE_URL, {
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    }).catch(null)
  ).data;

  const root = parse(page);
  const events = root.querySelectorAll(".news-content-index .news-type");

  const eventsList: IEvent[] = events
    .map((item) => {
      const [title, image, link] = [
        item
          .querySelector(".news-inner .news-text .news-title")
          ?.getAttribute("title"),
        item.querySelector(".img img")?.getAttribute("src"),
        item.getAttribute("href"),
      ];

      return {
        title: title?.trim(),
        image: image?.trim(),
        link: link?.trim(),
      } as IEvent;
    })
    .filter((item) => Boolean(item.title) && Boolean(item.image));

  return eventsList;
};
