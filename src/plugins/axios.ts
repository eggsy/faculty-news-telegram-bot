import axios from "axios";

const instance = axios.create({
  timeout: 20000,
});

export default instance;
