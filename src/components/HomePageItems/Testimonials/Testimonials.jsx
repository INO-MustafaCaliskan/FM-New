import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "./Testimonials.css";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Link from "next/link";

import { FreeMode, Pagination } from "swiper/modules";

const Testimonials = ({ data }) => {
  return (
    <div className="mt-5 mb-5">
      <div className="container">
        <h2 className="title-primary mb-5 mt-5">{data.Title}</h2>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
   
          991: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1400: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiperTestimonials container pt-1 px-2"
      >
        {data.List.map((item) => (
          <SwiperSlide key={item.Id} className="testimonials-swiper">
            <div className="testimonials-card">
              <Image
                className="testimonials-image"
                src={item.ImageUrl || "/images/personExample.jpg"}
                alt={item.Title || "testimonials-image"}
                width={100}
                height={100}
              />
              <div className="testimonials-content">
                <h6 className="testimonials-title">{item.Title}</h6>

                <div className="comment-area">
                  <FaQuoteLeft className="quote-left-icon" />
                  <p id="testimonialsText">
                    {" "}
                    {item.Description.length > 180
                      ? item.Description.substring(0, 180) + "..."
                      : item.Description}{" "}
                  </p>
                  <FaQuoteRight className="quote-right-icon" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
