import axios from "axios";

export const getNewsState = async () => {
  return axios("https://api.hop.io/v1/channels/maun-news/state", {
    headers: {
      Authorization: `${process.env.HOP_TOKEN}`,
    },
  });
};
