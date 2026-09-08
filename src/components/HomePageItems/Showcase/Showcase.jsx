import { FaCheckCircle } from "react-icons/fa";
import "./showcase.css";
import InoButton from "@/components/Buttons/InoButton";
import useIsMobile from "@/utils/hooks/useIsMobile";
import PropTypes from "prop-types";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

// handleClick fonksiyonu
const handleClick = (buttonUrl) => {
  window.location.href = buttonUrl;
};

const Showcase = ({ data }) => {
  const { user, loading } = useUser();
  const isMobile = useIsMobile();

  if (user) {
    return (
      <section className="home-showcase">
        <div className="home-showcase__content">
          <picture className="home-showcase__picture">
            <Image
              src="/images/banner-home-hero_1.webp"
              alt="Alternate Text"
              className="home-showcase__image"
              width={1600}
              height={800}
            />
          </picture>
          <div className="container">
            <div>
              <div className="pt-3">
                <h1 className="home-showcase-title mt-5">{data?.Title}</h1>
                <p className="home-showcase__desc">{data?.Description}</p>
                <div className="home-showcase__buttons">
                  {data.Button1Visible && (
                    <InoButton
                      title="Discover"
                      onClick={() => handleClick("/global-networkers")}
                    />
                  )}
                  {data.Button2Visible && (
                    <InoButton
                      isOutline
                      title={data.Button2Text}
                      onClick={() => handleClick(data.Button2Url)}
                    />
                  )}
                </div>

              </div>

              <div className="main-hero-content">
                <ul className="pl-0">
                  <li className="c1">
                    <p className="type">
                      {!isMobile && <FaCheckCircle className="check-icon" />}
                      <span className="main-hero-content_span">
                        {data.Spec1}
                      </span>
                    </p>
                  </li>
                  <li className="c1">
                    <p className="type">
                      {!isMobile && <FaCheckCircle className="check-icon" />}
                      <span className="main-hero-content_span">
                        {data.Spec2}
                      </span>
                    </p>
                  </li>
                  <li className="c1">
                    <p className="type">
                      {!isMobile && <FaCheckCircle className="check-icon" />}
                      <span className="main-hero-content_span">
                        {data.Spec3}
                      </span>
                    </p>
                  </li>
                  <li className="c1">
                    <p className="type">
                      {!isMobile && <FaCheckCircle className="check-icon" />}
                      <span className="main-hero-content_span">
                        {data.Spec4}
                      </span>
                    </p>
                  </li>
                  <li className="c1">
                    <p className="type">
                      {!isMobile && <FaCheckCircle className="check-icon" />}
                      <span className="main-hero-content_span">
                        {data.Spec5}
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-showcase">
      <div className="home-showcase__content">
        <picture className="home-showcase__picture">
          <Image
            src="/images/banner-home-hero_1.webp"
            alt="Alternate Text"
            className="home-showcase__image"
            width={1600}
            height={800}
          />
        </picture>
        <div className="container">
          <div>
            <div className="pt-3">


              <h1 className="home-showcase-title">{data?.Title}</h1>
              <p className="home-showcase__desc">{data?.Description}</p>
              <div className="home-showcase__buttons">
                {data.Button1Visible && (
                  <InoButton
                    title={data.Button1Text}
                    onClick={() => handleClick(data.Button1Url)}
                  />
                )}
                {data.Button2Visible && (
                  <InoButton
                    title={data.Button2Text}
                    isOutline
                    onClick={() => handleClick(data.Button2Url)}
                  />
                )}
              </div>
            </div>
            <div className="main-hero-content">
              <ul className="pl-0">
                <li className="c1">
                  <p className="type">
                    {!isMobile && <FaCheckCircle className="check-icon" />}
                    <span className="main-hero-content_span">{data.Spec1}</span>
                  </p>
                </li>
                <li className="c1">
                  <p className="type">
                    {!isMobile && <FaCheckCircle className="check-icon" />}
                    <span className="main-hero-content_span">{data.Spec2}</span>
                  </p>
                </li>
                <li className="c1">
                  <p className="type">
                    {!isMobile && <FaCheckCircle className="check-icon" />}
                    <span className="main-hero-content_span">{data.Spec3}</span>
                  </p>
                </li>
                <li className="c1">
                  <p className="type">
                    {!isMobile && <FaCheckCircle className="check-icon" />}
                    <span className="main-hero-content_span">{data.Spec4}</span>
                  </p>
                </li>
                <li className="c1">
                  <p className="type">
                    {!isMobile && <FaCheckCircle className="check-icon" />}
                    <span className="main-hero-content_span">{data.Spec5}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Showcase.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Showcase;
