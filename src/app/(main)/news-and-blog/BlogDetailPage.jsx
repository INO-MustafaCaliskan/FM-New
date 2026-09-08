"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Card } from "react-bootstrap";
import client from "@/utils/client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import BlogDetailSideCard from "@/components/BlogDetailSideCard/BlogDetailSideCard";
import BlogDetailTagsCard from "@/components/BlogDetailSideCard/BlogDetailTagsCard";
import useFormatDate from "@/utils/hooks/useFormatDate";
import BlogStructuredData from "@/components/Seo/BlogStructuredData";

const BlogDetailPage = () => {
  const searchParams = useParams();
  const seoUrl = searchParams.seoUrl;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = useFormatDate()
  useEffect(() => {
    if (seoUrl) {
      const fetchBlogDetail = async () => {
        try {
          const response = await client.get(`Blog/GetBySeoUrl/${seoUrl}`);
    
          if (response && response.data.success) {
            setBlog(response.data.data);
            
          }
        } catch (error) {
          console.error("Error fetching blog detail: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBlogDetail();
    }
  }, [seoUrl]);

  if (!blog) {
    return (
      <Container className="text-center">
        <p>Blog not found</p>
      </Container>
    );
  }

  return (
    <Container>
      
          <BlogStructuredData blog={blog} seoUrl={seoUrl} />

      <InoBreadcrumb linkName="Blog Detail" />
      <div className="d-flex flex-lg-row flex-column gap-3">
        <div className="col-12 col-lg-9">
          <Card>
            <Card.Img
              className="blog-detail-img"
              variant="top"
              src={blog.imageUrl || "/images/empty-image.png"}
              width={960}
            />
            <Card.Body>
              <div className="d-flex  justify-content-between ">
                <p>
                  <strong>Author:</strong> {blog.author}
                </p>
                <p>
                  <strong>Published on:</strong>{" "}
                  {formatDate(blog.publishDate,true)}
                </p>
              </div>

              <h1 className="mt-4" style={{ fontWeight: 800 , fontSize:"32px"}}>
                {blog.title}
              </h1>
              <Card.Text
                className="mt-4 talk-blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-lg-3 pe-3">
          <div className="f-flex flex-column">
            <BlogDetailSideCard title="Latest News And Blog" />
            <BlogDetailTagsCard  title="Categories" categories={blog.categories} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogDetailPage;
