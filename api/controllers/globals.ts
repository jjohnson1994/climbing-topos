import globals from "../datasources/globals";

export const getGlobals = (req, res) => {
  res.status(200).json(globals);
}
