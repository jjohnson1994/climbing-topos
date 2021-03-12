import { areas, crags, logs, routes } from "../services";
import { LogRequest } from "../../core/types";

export async function postLogs(req, res) {
  try {
    const logsDetails = req.body.logs as LogRequest[];
    const { user } = req;
    await logs.logRoutes(logsDetails, user);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error logging routes", error);
    res.status(500).json({ error: true });
  }
}
