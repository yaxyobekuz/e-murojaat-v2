// Arizalar ro'yxati ustidan filtr + qidiruv + pagination -> { rows, total }.
import { ageBucket } from "../mock/msk.data";

export const filterSortPaginate = (rows, params = {}) => {
  const { category, status, gender, ageBucket: ab, street, source, priority, worker, search, page = 1, limit = 12 } = params;
  let out = rows;

  if (category) out = out.filter((r) => r.category === category);
  if (status) out = out.filter((r) => r.status === status);
  if (gender) out = out.filter((r) => r.applicant.gender === gender);
  if (ab) out = out.filter((r) => ageBucket(r.applicant.age) === ab);
  if (street) out = out.filter((r) => r.address.street === street);
  if (source) out = out.filter((r) => r.source === source);
  if (priority) out = out.filter((r) => r.priority === priority);
  if (worker) out = out.filter((r) => r.assignedWorker?.id === worker);

  if (search) {
    const q = search.toLowerCase();
    out = out.filter((r) =>
      [r.appealNumber, r.applicant.name, r.address.street, r.address.house, r.assignedWorker?.name, r.description]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }

  const total = out.length;
  const start = (page - 1) * limit;
  return { rows: out.slice(start, start + limit), total };
};
