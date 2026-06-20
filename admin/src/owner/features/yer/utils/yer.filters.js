// Generic filter + search + pagination over a mock array -> { rows, total }
export const filterSortPaginate = (rows, params = {}) => {
  const { region, type, status, serviceType, search, page = 1, limit = 10 } = params;
  let out = rows;

  if (region) out = out.filter((r) => r.region === region);
  if (type) out = out.filter((r) => r.type === type);
  if (status) out = out.filter((r) => r.status === status);
  if (serviceType) out = out.filter((r) => r.serviceType === serviceType);

  if (search) {
    const q = search.toLowerCase();
    out = out.filter((r) =>
      [r.cadastreNumber, r.requestNumber, r.address, r.applicantName, r.region]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }

  const total = out.length;
  const start = (page - 1) * limit;
  return { rows: out.slice(start, start + limit), total };
};
