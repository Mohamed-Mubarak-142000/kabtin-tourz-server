function parsePagination({ page, limit }) {
  if (page === undefined && limit === undefined) return null;
  const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 5));
  return { page: parsedPage, limit: parsedLimit };
}

async function paginate(model, filter, sort, query) {
  const pagination = parsePagination(query);
  if (!pagination) return model.find(filter).sort(sort);

  const { page, limit } = pagination;
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    model.countDocuments(filter),
  ]);
  return {
    items,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

module.exports = { paginate };
