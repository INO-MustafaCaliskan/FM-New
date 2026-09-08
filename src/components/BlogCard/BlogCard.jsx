"use client";
import React from "react";
import { Card, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import InoButton from "@/components/Buttons/InoButton";
import "../BlogCard/BlogCard.css";
import useFormatDate from "@/utils/hooks/useFormatDate";

const BlogCard = ({ blog, onCardClick }) => {
  const formatDate = useFormatDate();
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Col sm={12} md={6} lg={4} className="mb-4">
      <Card
        className="blog-card-main"
        onClick={() => onCardClick(blog.seoUrl)}
        style={{ cursor: "pointer" }}
      >
        <Card.Img
          className="blog-small-img"
          variant="top"
          src={blog.publicImageUrl || "./images/no-photo.png"}
        />
        <Card.Body className="blog-card-body">
          <div className="d-flex  flex-column  justify-content-start align-items-start">
            <div className="d-flex category-main">
              {blog.categories.map((category) => (
                <div
                  key={category.categoryName}
                  className="blog-category me-1 mt-1 mt-lg-0"
                >
                  <p>{category.categoryName}</p>
                </div>
              ))}
            </div>
            <div className="text-start col-12  mt-2 ">
              <FontAwesomeIcon
                icon={faCalendar}
                color="grey"
                style={{ margin: "0px 5px 1px 0px" }}
              />
              {formatDate(blog.publishDate, true)}
            </div>
          </div>
          <div className="mt-3">
            <Card.Title style={{ color: "#EF6C00", fontWeight: 800 }}>
              {blog.title}
            </Card.Title>
            <Card.Text className="mt-3" style={{ textAlign: "justify" }}>
              {truncateText(blog.summaryText, 250)}
            </Card.Text>
          </div>
        </Card.Body>
        <div className="d-flex justify-content-end my-3">
          <InoButton title="Learn More >" noBackground height={35} />
        </div>
      </Card>
    </Col>
  );
};

export default BlogCard;
