import React from 'react';

export const usePaginatedItems = <T>(items: T[], resultsPerPage: number) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const incrementPage = () => {
    if (currentPage + 1 > totalPages) {
      return;
    }
    setCurrentPage((current) => current + 1);
  };

  const decrementPage = () => {
    if (currentPage - 1 < 1) {
      return;
    }
    setCurrentPage((current) => current - 1);
  };

  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil(items.length / resultsPerPage));
  }, [items.length, resultsPerPage]);

  if (currentPage < 1) {
    setCurrentPage(1);
  }

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, items, resultsPerPage]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    hasPreviousPage,
    hasNextPage,
    currentPage,
    totalPages,
    incrementPage,
    decrementPage,
    paginatedItems,
  };
};
