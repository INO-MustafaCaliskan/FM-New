"use client";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import Link from "next/link";

import "./teamcard.css";
const TeamCard = ({ name, title, linkedinUrl, imageUrl }) => {
  return (
    <div className="team-card-main col-12 col-sm-6  col-md-4 col-xl-2 ">
    <Card className="team-card  ">
      <Link className="linkedin-icon" href={linkedinUrl || ""} target="_blank">
        <Image
          width={32}
          height={32}
          className=""
          src="/images/linkedin.svg.png"
          alt={name || ""}
        />
      </Link>
      {/* <Card.Img variant="top" src={imageHook(imageUrl)} /> */}
      <Card.Img
        variant="top"
        src={imageUrl}
        className="team-image"
        style={{ width: "100%"}}
      />
      <Card.Body className="team-card-info">
        <Card.Title>{name}</Card.Title>
        <Card.Text>{title}</Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};
export default TeamCard;
