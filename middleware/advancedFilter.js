module.exports = (model, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "limit", "page"];
  removeFields.forEach((v) => {
    delete reqQuery[v];
  });
  const queryString = JSON.stringify(reqQuery).replace(
    /\b(in|gt|gte|lt|lte|eq|ne|nin)\b/g,
    (match) => `$${match}`
  );
  query = model.find(JSON.parse(queryString));
  if (req.query.select) {
    query.select(req.query.select.split(","));
  }
  const totalResults = await model.countDocuments(query);
  if (req.query.sort) {
    query.sort(req.query.sort.split(",").join(" "));
  } else {
    query.sort("-createdAt");
  }
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const startIndex = (page - 1) * limit;
  if (populate) {
    query.populate(populate);
  }
  const results = await query.limit(limit).skip(startIndex);
  res.advancedResult = {
    success: "true",
    total: totalResults,
    count: results.length,
    data: results,
  };
  next();
};
