import serverless from "serverless-http";
import express from "express";
import cors from "cors";

import areas from "./routes/areas";
import crags from "./routes/crags";
import globals from "./routes/globals";
import lists from "./routes/lists";
import logs from "./routes/logs";
import profile from "./routes/profile";
import routes from "./routes/routes";
import topos from "./routes/topos";
import uploads from "./routes/uploads";
import users from "./routes/users";

const app = express()

app.use(express.json());
app.use(cors());

app.use("/areas", areas);
app.use("/crags", crags);
app.use("/globals", globals);
app.use("/lists", lists);
app.use("/logs", logs);
app.use("/profile", profile);
app.use("/topos", topos);
app.use("/routes", routes);
app.use("/uploads", uploads);
app.use("/users", users);

export const handler = serverless(app);
