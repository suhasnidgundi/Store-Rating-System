export type PaginationQuery = {
  page?: number
  pageSize?: number
}

export function parsePagination(q: PaginationQuery) {
  const page = Math.max(1, Number(q.page) || 1)
  const pageSize = Math.max(1, Math.min(100, Number(q.pageSize) || 10))
  const skip = (page - 1) * pageSize
  const take = pageSize
  return { page, pageSize, skip, take }
}
