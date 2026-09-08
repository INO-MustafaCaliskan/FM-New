import React from "react";
import { Pagination } from "react-bootstrap"; // Assuming you're using React Bootstrap

const InoPagination = ({ currentPage, totalPage, onPageChange }) => {
  const MAX_PAGES_DISPLAYED = 5; // Maximum number of pages to display

  // Calculate the start and end page numbers
  const getPageNumbers = () => {
    const pages = [];
    const halfMaxPages = Math.floor(MAX_PAGES_DISPLAYED / 2);

    // If total pages are less than or equal to MAX_PAGES_DISPLAYED
    if (totalPage <= MAX_PAGES_DISPLAYED) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      // Calculate the start and end pages around the current page
      let startPage = Math.max(currentPage - halfMaxPages, 1);
      let endPage = Math.min(startPage + MAX_PAGES_DISPLAYED - 1, totalPage);

      // Adjust startPage if we're close to the end of the pages
      if (endPage === totalPage) {
        startPage = totalPage - MAX_PAGES_DISPLAYED + 1;
      }

      // Add page numbers to the array
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />

      {/* Render the first page and ellipsis if needed */}
      {totalPage > MAX_PAGES_DISPLAYED && pages[0] !== 1 && (
        <>
          <Pagination.Item onClick={() => onPageChange(1)}>{1}</Pagination.Item>
          {pages[0] > 2 && <Pagination.Ellipsis className="pe-none" />}
        </>
      )}

      {/* Render the page numbers */}
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      {/* Render ellipsis and last page if needed */}
      {totalPage > MAX_PAGES_DISPLAYED && pages[pages.length - 1] < totalPage && (
        <>
          {pages[pages.length - 1] < totalPage - 1 && <Pagination.Ellipsis className="pe-none" />}
          <Pagination.Item onClick={() => onPageChange(totalPage)}>
            {totalPage}
          </Pagination.Item>
        </>
      )}

      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPage} />
      <Pagination.Last onClick={() => onPageChange(totalPage)} disabled={currentPage === totalPage} />
    </Pagination>
  );
};

export default InoPagination;
