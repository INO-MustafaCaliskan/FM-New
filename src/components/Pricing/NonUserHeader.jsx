import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export const NonUserHeader = ({pricingInfo}) => {
    return (
        <>
          <section id="pricing-info-section">
            <div className="static-page__content pricing-page__content">
              <Image
                src={pricingInfo.ImageUrl || "/images/freight-talk-logo.png"}
                alt="Freight Talk"
                width={400}
                height={100}
                className="pricing-page__image"
              />
    
              <h1 className="pricing-page__title">{pricingInfo.Description}</h1>
    
              <Link className="button button-primary" href={pricingInfo.ButtonUrl}>
                {pricingInfo.ButtonText}
              </Link>
    
              <h2 className="pricing-page__sub-title">
                {pricingInfo.ContentTitle}
              </h2>
    
              <div className="pricing-page__text">
                {pricingInfo.ContentDescription}
              </div>
            </div>
          </section>
        </>
      );
}
