import serverless from "serverless-http";
import express from "express";

import auth from "./routes/auth";
import crags from "./routes/crags";

const app = express()

app.use(express.json());

app.use("/crags", crags);
app.use("/auth", auth);

export const handler = serverless(app);
