"use client";
import Image from "next/image";
import "./starterBanner.css";
import Link from "next/link";
const StarterBanner = ({ data }) => {
  return (
    <section className="home-started-banner">

      <div className="container">
        <picture className="home-started-banner__picture">
          <Image
            src="/images/banner-home-desktop-get-started.webp"
            width={1296}
            height={281}
            alt="If you're not networking, you're not working"
            className="home-started-banner__image"
          />
        </picture>

        <div className="home-started-banner__content col-12 col-md-6 starterBannerContent">
          <h3 className="home-started-banner__title">{data.Title}</h3>
          <p className="home-started-banner__text">{data.Description}</p>
          <Link className="start-banner-button-link d-flex justify-content-center align-items-center rounded shadow" href={data.ButtonUrl}>{data.ButtonText}</Link>
        </div>
      </div>
    </section>
  );
};

export default StarterBanner;
