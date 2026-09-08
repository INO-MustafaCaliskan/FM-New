"use client";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import "./what.css";
import InoAccordion from "@/components/InoAccordion/InoAccordion";
import useIsMobile from "@/utils/hooks/useIsMobile";
import PropTypes from "prop-types";

const What = ({ data }) => {
  const [activeKey, setActiveKey] = useState("0");
  const isMobile = useIsMobile();

  return (
    <section className="home-what">
      <div className="container">
        {isMobile ? (
          <InoAccordion
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            eventKey="0"
            title={<h2 className="title-primary">{data.Title}</h2>}
            description={
              <p className="home-what__desc" style={{ textAlign: "justify" }}>
                {data.Description}
              </p>
            }
          />
        ) : (
          <>
            <h2 className="title title-primary">{data.Title}</h2>
            <p className="home-what__desc" style={{ textAlign: "justify" }}>
              {data.Description}
            </p>
            <div className="home-what__boxes d-flex justify-content-between mt-4">
              <Card style={{ width: "18rem" }}>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Img
                    className="what-image"
                    variant="top "
                    src={data.Card1ImageUrl}
                  />
                  <Card.Title className="mt-2 what-title">
                    {data.Card1Title}
                  </Card.Title>
                  <Card.Text className="text-center CardTextNoHyphen">
                    {data.Card1Description}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }}>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Img
                    className="what-image"
                    variant="top"
                    src={data.Card2ImageUrl}
                  />
                  <Card.Title className="mt-2 what-title">
                    {data.Card2Title}
                  </Card.Title>
                  <Card.Text className="text-center CardTextNoHyphen">
                    {data.Card2Description}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }}>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Img
                    className="what-image"
                    variant="top"
                    src={data.Card3ImageUrl}
                  />
                  <Card.Title className="mt-2 what-title">
                    {data.Card3Title}
                  </Card.Title>
                  <Card.Text className="text-center CardTextNoHyphen">
                    {data.Card3Description}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }}>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Img
                    className="what-image"
                    variant="top"
                    src={data.Card4ImageUrl}
                  />
                  <Card.Title className="mt-2 what-title">
                    {data.Card4Title}
                  </Card.Title>
                  <Card.Text className="text-center CardTextNoHyphen">
                    {data.Card4Description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </>
        )}
      </div>
    </section>
  );
};



What.propTypes = {
  title: PropTypes.string,
};

export default What;
