import serverless from "serverless-http";
import express from "express";
import cors from "cors";

import areas from "./routes/areas";
import crags from "./routes/crags";
import lists from "./routes/lists";
import logs from "./routes/logs";
import profile from "./routes/profile";
import routes from "./routes/routes";
import topos from "./routes/topos";
import uploads from "./routes/uploads";

const app = express()

app.use(express.json());
app.use(cors({
  origin: process.env.IS_OFFLINE
    ? "http://localhost:3000"
    : "https://climbingtopos.com",
  optionsSuccessStatus: 200
}));

app.use("/areas", areas);
app.use("/crags", crags);
app.use("/lists", lists);
app.use("/logs", logs);
app.use("/profile", profile);
app.use("/topos", topos);
app.use("/routes", routes);
app.use("/uploads", uploads);

export const handler = serverless(app);
