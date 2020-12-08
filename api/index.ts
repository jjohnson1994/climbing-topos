import serverless from "serverless-http";
import express from "express";

import areas from "./routes/areas";
import crags from "./routes/crags";
import globals from "./routes/globals";
import topos from "./routes/topos";

const app = express()

app.use(express.json());

app.use("/areas", areas);
app.use("/crags", crags);
app.use("/globals", globals);
app.use("/topos", topos);

export const handler = serverless(app);
