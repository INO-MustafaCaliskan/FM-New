"use client";
import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import client from "@/utils/client";
import BlogCard from "@/components/BlogCard/BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import InoPagination from "@/components/UI/InoPagination";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const param = useSearchParams();
  const catId = param.get("catId");
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/Blog/GetPublicBlogsPaging?pageNumber=${currentPage}&pageSize=6&blogTitle=${searchQuery}`;

      if (catId) {
        url += `&catId=${catId}`;
      }
      const response = await client.get(url);

      if (response && response.data.success) {
        setBlogs(response.data.data.listItems);
        setTotalPages(response.data.data.totalPage);
      }
    } catch (error) {
      console.error("Error fetching blogs: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, param]);

  const handleCardClick = (seoUrl) => {
    router.push(`/news-and-blog/${seoUrl}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    setCurrentPage(1);
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <section className="blog-section">
      <Card className="px-5 pt-2 mt-2">
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center mb-4">
          <h1 className="mt-4" style={{ fontSize: "32px", fontWeight: "500" }}>
            Business Networking Insights, Blog
            and Trends
          </h1>
          <div
            className="my-2 position-relative pr-0 pl-0 search-input"
            style={{ paddingLeft: "0" }}
          >
            <label
              htmlFor="search-blog"
              className="form-label search-meeting-input-label"
              style={{ top: "9px !important" }}
            >
              Search News And Blog
            </label>
            <input
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              type="text"
              value={searchQuery}
              placeholder="Enter Blog Title "
              className="form-control"
              id="search-blog"
              aria-describedby="search-blog-help"
            />
            <button
              className="position-absolute"
              style={{ top: "48%", right: "4%", zIndex: "2" }}
              onClick={handleSearchSubmit}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <CircularProgress />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center my-5">
            <h3
              style={{
                fontWeight: "700",
                fontSize: "28px",
                color: "#0f0f2d",
              }}
            >
              No results found
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#6c6c77",
                marginTop: "8px",
              }}
            >
              It seems we can’t find any results based on your search.
            </p>
          </div>
        ) : (
          <Row>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onCardClick={handleCardClick}
              />
            ))}
          </Row>
        )}

        <div className="d-flex justify-content-center mt-2">
          <InoPagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </section>
  );
};

export default BlogList;
