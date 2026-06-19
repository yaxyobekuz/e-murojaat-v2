// Drops empty-string query params — an unset filter (`?type=`) means "not provided",
// not an invalid enum value. Body is left as-is ("" there can be meaningful).
const stripEmptyQuery = (query) => {
  if (!query || typeof query !== "object") return query;
  const out = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === "") continue;
    out[key] = value;
  }
  return out;
};

// Validates and parses req.body/query/params via a Zod schema
const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: stripEmptyQuery(req.query),
      params: req.params,
    });
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (err) {
    next(err);
  }
};

export default validate;
