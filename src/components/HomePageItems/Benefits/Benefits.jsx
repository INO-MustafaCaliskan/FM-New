"use client";
import React, { useState, useEffect } from "react";
import InoAccordion from "@/components/InoAccordion/InoAccordion";
import useIsMobile from "@/utils/hooks/useIsMobile";
import Image from "next/image";
const Benefits = ({data}) => {
  const [activeKey, setActiveKey] = useState("0");
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <>
          <InoAccordion
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            eventKey="0"
            title={
              <h6 className="title-primary benefits-title">
                {data.Card1Title}
           
              </h6>
            }
            description={
              <p className="description-benefits js-benefits-accordion-text active">
                {data.Card1Description}
              </p>
            }
          />
          <InoAccordion
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            eventKey="2"
            title={
              <h6 className="title-primary benefits-title">
               {data.Card2Title}
              </h6>
            }
            description={
              <p className="description-benefits js-benefits-accordion-text active">
                  {data.Card2Description}
              </p>
            }
          />
          <InoAccordion
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            eventKey="1"
            title={
              <h6 className="title-primary benefits-title">
               {data.Card3Title}
              </h6>
            }
            description={
              <p className="description-benefits js-benefits-accordion-text active">
                  {data.Card3Description}
              </p>
            }
          />
        </>
      ) : (
        <>
          <section className="home-benefits">
            <div className="container">
              <h2 className="title-primary">{data.Title}</h2>
              <div className="home-benefits__root">
                <picture className="home-benefits__picture">
                  <Image
                    src={data.ImageUrl}
                    alt="Freight Talk"
                    className="home-benefits__image"
                    width={400}
                    height={400}
                  />
                </picture>
                <div className="home-benefits__content ">
                  <div className="home-benefits__item js-benefits-accordion-item active">
                    <div className="home-benefits__title js-benefits-accordion-title active">
                      <Image
                        src={data.Card1ImageUrl || "/images/empty-image.png"}
                        alt="Freight Talk"
                        width={50} height={50} 
                      />
                      <h3 className="home-benefits__title-text">
                        {data.Card1Title}
                      </h3>
                
                    </div>
                    <p className="home-benefits__desc js-benefits-accordion-text active">
                       {data.Card1Description}
                    </p>
                  </div>
                  <div className="home-benefits__item js-benefits-accordion-item active">
                    <div className="home-benefits__title js-benefits-accordion-title active">
                      <Image
                        src={data.Card2ImageUrl || "/images/empty-image.png"}
                        alt="Freight Talk"
                        width={50} height={50} 
                      />
                      <h3 className="home-benefits__title-text">
                        {data.Card2Title}
                      </h3>
                  
                    </div>
                    <p className="home-benefits__desc js-benefits-accordion-text active">
                      {data.Card2Description}
                    </p>
                  </div>
                  <div className="home-benefits__item js-benefits-accordion-item active">
                    <div className="home-benefits__title js-benefits-accordion-title active">
                      <Image
                        src={data.Card3ImageUrl || "/images/empty-image.png"}
                        alt="Freight Talk"
                        width={50} height={50} 
                      />
                      <h3 className="home-benefits__title-text">
                         {data.Card3Title}
                      </h3>
                  
                    </div>
                    <p className="home-benefits__desc js-benefits-accordion-text active">
                       {data.Card3Description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Benefits;
