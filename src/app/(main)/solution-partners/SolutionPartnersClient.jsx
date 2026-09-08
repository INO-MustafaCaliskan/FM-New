"use client";
import React, { useEffect, useState } from "react";
import "./solution-partners-list.css";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import client from "@/utils/client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import { Container } from "react-bootstrap";
import InoPagination from "@/components/UI/InoPagination";

const pageSize = 6;

const SolutionPartners = () => {
  const router = useRouter();

  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 const truncateText = (text = "", maxLength = 300) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  const handleReadMore = (seoUrl) => {
    router.push(`/solution-partners-detail/${seoUrl}`);
  };

  const fetchPartnersWithParams = async (pageNum, searchTerm) => {
    try {
      setIsLoading(true);

      const encodedSearch = encodeURIComponent(searchTerm ?? "");
      const url = `/SolutionPartner/GetPaginatedList?pageNumber=${pageNum}&pageSize=${pageSize}&search=${encodedSearch}`;

      const response = await client.get(url);
      const data = response.data?.data;

      if (response.data.success && data) {
        setPartners(data.listItems || []);
        setTotalPages(data.totalPage || 1);
      } else {
        setPartners([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("SolutionPartner fetch error:", error);
      setPartners([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnersWithParams(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <InoBreadcrumb linkName="Our Solution Partners" />

      <div className="mt-4 mb-5 solution-partners-wrapper">
        <h1 className="mt-2">Our Solution Partners</h1>

        <div className="solution-partners-search-container mb-4">
          <div className="solution-partners-search-input-wrapper">
            <FaSearch className="solution-partners-search-icon" />
            <input
              type="text"
              placeholder="Search partner"
              className="solution-partners-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <button
            className="solution-partners-search-button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <>
            <div className="row">
              {partners.length > 0 ? (
                partners.map((item) => (
                  <div key={item.solutionPartnerId} className="col-md-6 col-xl-4 mb-4">
                    <div className="card solution-partners-card shadow-sm h-100">
                      <div className="solution-partners-image-area text-center p-3">
                        <img
                          src={item.imageUrl || "/images/no-img.png"}
                          alt={item.name}
                          className="solution-partners-avatar"
                        />
                      </div>

                      <div className="card-body">
                        <h5>{item.name}</h5>
                        <h6>{item.title}</h6>
                        <p className="solution-partners-text">  {truncateText(item.shortDescription, 300)}</p>
                      </div>

                      <div className="text-end pe-3 pb-3">
                        <button
                          onClick={() => handleReadMore(item.seoUrl)}
                          className="solution-partners-read-more"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No partners found</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <InoPagination
                  currentPage={currentPage}
                  totalPage={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default SolutionPartners;
