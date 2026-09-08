"use client";
import React from "react";
import useFormatDate from "@/utils/hooks/useFormatDate";
const BlogStructuredData = ({ blog, seoUrl }) => {
      const formatDate = useFormatDate();
  if (!blog) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://freighttalk.com/news-and-blog/${seoUrl}`,
    },
    "headline": blog.title,
    "description": blog.shortDescription || blog.title,
    "image": [blog.imageUrl],
    "datePublished": formatDate(blog.publishDate, true),
    "dateModified": formatDate(blog.updatedDate, true) || formatDate(blog.publishDate, true) ,
    "author": {
      "@type": "Person",
      "name": blog.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "FreightTalk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://freighttalk.com/images/freight-talk-logo.jpg",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default BlogStructuredData;
