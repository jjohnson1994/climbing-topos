import serverless from "serverless-http";
import express from "express";

import crags from "./routes/crags";
import globals from "./routes/globals";

const app = express()

app.use(express.json());

app.use("/crags", crags);
app.use("/globals", globals);

export const handler = serverless(app);
