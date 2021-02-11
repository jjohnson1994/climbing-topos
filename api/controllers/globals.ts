import { globals } from "../services";

export async function getGlobals(req, res) {
  try {
    const _globals = await globals.getGlobals();
    res.status(200).json(_globals);
  } catch(error) {
    console.error("Error getting globals", error);
    res.status(500).json({ error: true });
  }
}
