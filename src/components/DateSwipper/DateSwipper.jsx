import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./dateSwipper.css";

SwiperCore.use([Navigation]);

const generateDates = () => {
  const dates = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); 
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  for (
    let date = new Date(startDate);
    date < endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date));
  }
  return dates;
};

const DateSwiper = ({ onDateSelect, initialDate }) => {
  const dates = generateDates();

  const initialDateIndex = dates.findIndex(
    (date) => date.toDateString() === initialDate.toDateString()
  );

  const [selectedDate, setSelectedDate] = useState(initialDate);
 
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div id="datepicker" className="meeting-datepicker">
      <div className="row justify-content-center">
        <div className="position-relative">
          <div className=" meeting-datepicker-swiper2  schedule-main-swiper ">
            <Swiper
             className="schedule-swiper"
              slidesPerView={7}
              spaceBetween={0}
              navigation
              slidesPerGroup={4}
              initialSlide={initialDateIndex}
            >
              {dates.map((date, index) => (
                <SwiperSlide
                  key={date}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDateSelect(date)}
                >
                  <div
                    className={`card calendar-card ${
                      selectedDate &&
                      selectedDate.toDateString() === date.toDateString()
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="date-swipper-card-body card-body">
                      <div className="meeting-datepicker-month">
                        {date.toLocaleString("en-US", { month: "short" })}
                      </div>
                      <div className="meeting-datepicker-today">
                        {date.getDate()}
                      </div>
                      <div className="meeting-datepicker-datename">
                        {date.toLocaleString("en-US", { weekday: "short" })}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSwiper;
