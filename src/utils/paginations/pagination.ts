export interface paginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Generate pagination meta
 * @param total elements
 * @param page current page
 * @param limit total elements in page
 * @returns paginationMeta objects
 */
export const generatePaginationMeta = (
  total: number,
  page: number,
  limit: number
): paginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
