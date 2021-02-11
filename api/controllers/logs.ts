import { LogRequest } from "../../core/types";
import { logs } from "../services";

export async function postLogs(req, res) {
  try {
    const logsDetails = req.body.logs as LogRequest[];
    const userSub = req.user.sub;
    await logs.logRoutes(logsDetails, userSub);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error logging routes", error);
    res.status(500).json({ error: true });
  }
}
