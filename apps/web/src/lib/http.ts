import { env } from "@fossus/env/web";
import axios from "axios";

const http = axios.create({
  baseURL: `${env.NEXT_PUBLIC_SERVER_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export default http;
