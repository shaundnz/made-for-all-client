import React from 'react';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';

export const usePaginatedPlaylists = (
  playlists: GetAllTrackedPlaylistResponseDto,
  resultsPerPage: number,
) => {
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
    return Math.max(1, Math.ceil(playlists.length / resultsPerPage));
  }, [playlists.length, resultsPerPage]);

  if (currentPage < 1) {
    setCurrentPage(1);
  }

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedPlaylists = React.useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return playlists.slice(startIndex, endIndex);
  }, [currentPage, playlists, resultsPerPage]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    hasPreviousPage,
    hasNextPage,
    currentPage,
    totalPages,
    incrementPage,
    decrementPage,
    paginatedPlaylists,
  };
};
