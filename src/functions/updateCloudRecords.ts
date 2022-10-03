import axios from "axios";
import type { NewsOrAnnouncements } from "../@types/news";

export const updateCloudRecords = async (news: NewsOrAnnouncements[]) => {
  if (!process.env.HOP_TOKEN) return;

  const result = await axios("https://api.hop.io/v1/channels/maun-news/state", {
    method: "PATCH",
    data: {
      news,
    },
    headers: {
      Authorization: process.env.HOP_TOKEN,
    },
  });

  if (result.status !== 200 || result.data.success === false)
    throw new Error("Failed connection to Hop Console.");

  return true;
};
