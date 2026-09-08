"use client";
import React from "react";

import Link from "next/link";
import { Card } from "react-bootstrap";

import "../BlogDetailSideCard/BlogDetailSideCard.css";

const BlogDetailTagsCard = ({ title, categories }) => {
  const data = categories;

  return (
    <>
      <Card>
        <Card.Header
          style={{ fontWeight: 700, color: "#f97a29", fontSize: 16 }}
        >
          {title}
        </Card.Header>
        <Card.Body className="d-flex gap-2">
          {data.length > 0 ? (
            data.map((item) => (
              <Link href={`/news-and-blog?catId=${item.id}`} key={item.id}>
                <div className="blog-detail-side-category" >
                  <span> {item.categoryName}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>No recent blogs available.</p>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default BlogDetailTagsCard;
