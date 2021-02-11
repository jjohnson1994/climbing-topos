import { globals } from "../repositories";

export async function getGlobals() {
  return globals.getAllGlobals();
}
