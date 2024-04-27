"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ClientPagination = ({
  totalPage,
  currentPage,
  setPage
}: {
  totalPage: number;
  currentPage: number;
  setPage: (page: number) => void;
}) => {
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setPage(page)
  };

  return (
    totalPage > 1 && (
      <Pagination>
        <PaginationContent>
          {currentPage !== 1 && (
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}
          {Array.from(Array(totalPage), (e, page) => (
            <PaginationItem key={page} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(page + 1)}
                isActive={currentPage === page + 1}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage !== totalPage && (
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  );
};

export default ClientPagination;