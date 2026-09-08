"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Spinner } from "react-bootstrap";
import client from "@/utils/client";
import "../BlogDetailSideCard/BlogDetailSideCard.css"
import useFormatDate from "@/utils/hooks/useFormatDate";



const BlogDetailSideCard = ({ title }) => {
  const formatDate = useFormatDate()
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/Blog/GetLastBlogsWithCount/5`);
        if (response && response.data.success) {
          setLatestBlogs(response.data.data);
          
        }
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Card>
            <Card.Header style={{fontWeight:700, color:'#f97a29', fontSize:16}}>{title}</Card.Header>
            <Card.Body className="d-flex flex-column">
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog) => (
                  <Link href={`/news-and-blog/${blog.seoUrl}`} key={blog.id}>
                    <div className="d-flex mb-3 blog-link" style={{ cursor: 'pointer' }}>
                      <div className="me-3">
                        <Image
                          className="blog-side-image"
                          src={blog.publicImageUrl || "/images/empty-image.png"}
                          alt="Blog Image"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <p  className="blog-side-title" style={{ fontWeight: 600 }}>{blog.title}</p>
                        <p  className="blog-side-date">{formatDate(blog.publishDate)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No recent blogs available.</p>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default BlogDetailSideCard;
