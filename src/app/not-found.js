"use client"
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import InoButton from "@/components/Buttons/InoButton";


export default function NotFound() {
    const homeMain = {
      backgroundColor: "black"
    }

    const container404 = {
      position: "relative",
      width: "100%",
      height: "100vh", /* Make the container take up the full viewport height */
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }
    const imageWrapper404 = {
      position: "relative",
      width: "100%",
      height: "100%",
    }
    const image404 = {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
    const textOverlay404 = {
      position: "absolute",
      top: "65%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      padding: "20px",
      borderRadius: "10px"
    }

  return (
    <div style={container404} >
      <div style={imageWrapper404}>
        <Image
          src="/images/freight_talk_404.svg"
          alt="404"
          layout="fill" 
          objectFit="cover"
          style={image404}
        />
        <div style={textOverlay404}>
          <h1>Oops!</h1>
          <h5>We’re sorry but it looks like the page doesn’t exist anymore.</h5>
          <Link href="/" passHref>
            <InoButton className="mt-3" title="Back to Home" isOutline />
          </Link>
        </div>
      </div>
    </div>
  );
}