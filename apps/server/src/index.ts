import { env } from "@fossus/env/server";
import cors from "cors";
import express from "express";

import { bueiroRouter } from "./routes/bueiros";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/bueiros", bueiroRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
