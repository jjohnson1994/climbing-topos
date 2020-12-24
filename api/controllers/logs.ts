import { logs } from "../services";
import { LogRequest } from "../../core/types";

export async function postLogs(req, res) {
  try {
    const logsDetails = req.body as LogRequest[];
    await logs.logRoutes(logsDetails);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error logging routes", error);
    res.status(500).json({ error: true });
  }
}
