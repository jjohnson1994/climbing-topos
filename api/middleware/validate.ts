export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      const valid = await schema.isValid(req.body);
        if (valid) {
          next();
        } else {
          res.status(400).json({ error: true });
        }
    } catch (error) {
      console.error("Error validating schema", error);
      res.status(500).json({ error: true });
    }
  }
}

export function validateQuery(schema) {
  return async (req, res, next) => {
    try {
      const valid = await schema.isValid(req.query);
        if (valid) {
          next();
        } else {
          res.status(400).json({ error: true });
        }
    } catch (error) {
      console.error("Error validating schema", error);
      res.status(500).json({ error: true });
    }
  }
}
