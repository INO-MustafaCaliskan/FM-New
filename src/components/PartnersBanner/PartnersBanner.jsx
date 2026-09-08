"use client";
import React, {useEffect, useState} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import client from "@/utils/client";
import "swiper/css";
import "swiper/css/autoplay";
import "./partners-banner.css";



const PartnersBanner = () => {
   const [sponsors, setSponsors] = useState([]);


   useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await client.get("/SolutionPartner/GetList");
     
        if (response?.data?.success) {
         
          const mappedData = response.data.data.map((item) => ({
            id: item.id,
            logo: item.imageUrl,
            url: item.website,   
          }));
          setSponsors(mappedData);
        }
      } catch (error) {
        console.error("Sponsor verisi alınamadı:", error);
      }
    };

    fetchSponsors();
  }, []);

  if (sponsors.length <= 2) {
    return (
      <div className="sponsor-banner static">
        <div className="static-sponsors">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="static-sponsor-item"
            >
              <img
                src={sponsor.logo}
                alt="Sponsor logo"
                className="img-fluid sponsor-logo"
              />
            </a>
          ))}
        </div>
      </div>
    );
  }


  const extendedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="sponsor-banner">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={15}
        loop
        freeMode={{ enabled: true, momentum: false }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={16000}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        
      >
        {extendedSponsors.map((sponsor, index) => (
          <SwiperSlide key={`${sponsor.id}-${index}`} style={{height:"90px"}}>
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src={sponsor.logo}
                alt="Sponsor logo"
                className="img-fluid sponsor-logo"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PartnersBanner;
