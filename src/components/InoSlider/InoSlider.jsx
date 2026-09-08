"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import PropTypes from "prop-types";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import styles from "./InoSlider.module.css";

import { FreeMode, Pagination } from "swiper/modules";
import { Container } from "react-bootstrap";

const InoSlider = ({ list }) => {
  if (!list || list.length === 0) {
    return null;
  }

  return (
    <Container>
      <Swiper
        slidesPerView={5}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          991: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
       
          576: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          0: {
            slidesPerView: 1.5,
            spaceBetween:30,
          },
        }}
        modules={[FreeMode, Pagination]}
        className={`${styles.swiper_main} `}
      >
        {list.map((item) => {
          return (
            <SwiperSlide key={item.Id} className={styles.swiper_slide}>
              <Image
                className={styles.slider_card}
                src={item.ImageUrl || "images/personExample.jpg"}
                alt={item.FullName}
                width={230}
                height={100}
                style={{ width: "100%", height: "230px" }} // optional
              />
              <div className={styles.slider_content}>
                <h6>{item.FullName}</h6>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
};

InoSlider.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      FullName: PropTypes.string,
      ImageUrl: PropTypes.string,
      Id: PropTypes.string,
    })
  ),
};

export default InoSlider;
