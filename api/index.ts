import serverless from "serverless-http";
import express from "express";

import crags from "./routes/crags";

const app = express()

app.use(express.json());

app.use("/crags", crags);

export const handler = serverless(app);
