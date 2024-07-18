import {
  Pagination as PaginationBase,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export interface PaginationProps {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const Pagination = ({
  hasPreviousPage,
  hasNextPage,
  currentPage,
  totalPages,
  onPreviousClick,
  onNextClick,
}: PaginationProps) => {
  return (
    <PaginationBase>
      <PaginationContent>
        {hasPreviousPage && (
          <>
            <PaginationItem onClick={onPreviousClick}>
              <PaginationPrevious />
            </PaginationItem>
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem onClick={onPreviousClick}>
              <PaginationLink>{currentPage - 1}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {hasNextPage && (
          <>
            <PaginationItem onClick={onNextClick}>
              <PaginationLink>{currentPage + 1}</PaginationLink>
            </PaginationItem>
            {totalPages - currentPage > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem onClick={onNextClick}>
              <PaginationNext />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationBase>
  );
};
