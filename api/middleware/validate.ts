export function validateBody(schema) {
  return ({ req, res, next }) => {
    schema
      .isValid(req.body)
      .then((valid: Boolean) => {
        if (valid) {
          next();
        } else {
          res.status(400).json({ error: true });
        }
      });
  }
}
