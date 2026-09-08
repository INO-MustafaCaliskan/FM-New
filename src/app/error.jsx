"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import InoButton from "@/components/Buttons/InoButton";


export default function ErrorPage({ error, reset }) {
  // Inline style objects
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    padding: "2rem",
  };

  // Image wrapper limits the SVG size and centers it over the page
  // Image wrapper now part of normal flow, centered with margin
  const imageWrapperStyle = {
    width: "300px",
    height: "300px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const overlayStyle = {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#333",
    padding: "0 1rem",
  };

  const titleStyle = {
    fontSize: "3rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };

  const messageStyle = {
    fontSize: "1.25rem",
    marginBottom: "1.5rem",
  };

  return (
    <div style={containerStyle}>
      <div style={imageWrapperStyle}>
        <Image
          src="/images/505.svg"
          alt="500"
          width={300}
          height={300}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>500 Internal Server Error</h1>
        <h5 style={messageStyle}>We’re sorry, but an internal server error occurred. If this problem persists, please contact support.</h5>
        <InoButton className="mt-3 me-2" title="Try Again" onClick={reset} />
        <Link href="/" passHref>
          <InoButton className="mt-3" title="Back to Home" isOutline />
        </Link>
      </div>
    </div>
  );
}