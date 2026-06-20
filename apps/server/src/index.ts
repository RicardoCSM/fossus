import { env } from "@fossus/env/server";
import cors from "cors";
import express from "express";

import { bueiroRouter } from "./routes/bueiros";
import { manutencaoRouter } from "./routes/manutencao";
import { equipeRouter } from "./routes/equipes";
import { sensoresRouter } from "./routes/sensores";
import { tiposSensorRouter } from "./routes/tipos-sensores";
import { leiturasRouter } from "./routes/leituras";
import { alertasRouter } from "./routes/alertas";
import { tiposAlertaRouter } from "./routes/tipos-alerta";

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
app.use("/api/manutencoes", manutencaoRouter);
app.use("/api/equipes", equipeRouter);
app.use("/api/sensores", sensoresRouter);
app.use("/api/tipos-sensores", tiposSensorRouter);
app.use("/api/leituras", leiturasRouter);
app.use("/api/alertas", alertasRouter);
app.use("/api/tipos-alerta", tiposAlertaRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
