"use client";
import React from "react";
import { Container } from "react-bootstrap";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import BlogList from "@/components/BlogList/BlogList";
export const metadata = {
  title: "Business Networking Insights, Blog and Trendss",
  description: "Connect with the team behind Freight Talk.",
};
const NewsAndBlogClient = () => {
  return (
    <Container>
      <InoBreadcrumb linkName="News And Blog" />
      <BlogList />
    </Container>
  );
};

export default NewsAndBlogClient;
