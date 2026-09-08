import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import client from "@/utils/client";
import Select from "react-select";
import InoButton from "../Buttons/InoButton";
import useFormatDate from "@/utils/hooks/useFormatDate";
import DateSwiper from "../DateSwipper/DateSwipper";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { toZonedTime } from "date-fns-tz";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const tz = Cookies.get("timeZone") || "UTC ";
const formattedTimeZone = moment.tz(tz).format("Z");
const convertToUserTime = (dateString) => {
  return toZonedTime(new Date(dateString), tz);
};

const gmtOffset = moment.tz(tz).format("Z");
export default function RescheduleModal({ show, handleClose, userId }) {
  const initialSelectedDate = new Date();
  const [userInfo, setUserInfo] = useState({});
  const [blockDates, setBlockDates] = useState([]);
  const [filteredBlockDates, setFilteredBlockDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    initialSelectedDate.toISOString()
  );
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const formatTime = useFormatDate();
  const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await client.get(
            `/User/GetOnlineNetworkerDetailById/${userId}`
          );
          const responseData = response.data.data;
          setUserInfo(responseData);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }

        try {
          const blockDatesResponse = await client.get(
            `/User/GetAllBlockedDates/${userId}`
          );
          let unavailableDates = blockDatesResponse.data.data;
       
          setBlockDates(unavailableDates);
          const initialDate = meeting
            ? new Date(meeting.startTime)
            : new Date();
          setSelectedDate(formatYearDate(initialDate));
        } catch (error) {
          console.error("Error fetching block dates:", error);
        }
      };

      fetchData();
    }
  }, [show, userId]);

  //Eger birden fazla gün blocklanmış ise her bir günün block saatlerini ayrı olarak göstermek adına methot değiştirildi.
  useEffect(() => {
    if (selectedDate && blockDates.length) {
      const selectedDayStart = new Date(selectedDate).setHours(0, 0, 0, 0);
      const selectedDayEnd = new Date(selectedDate).setHours(23, 59, 59, 999);
      const blockDays = blockDates
        .map((blockDate) => {
          const blockStartTime = new Date(blockDate.startTime);
          const blockEndTime = new Date(blockDate.endTime);
          const blockStartDay = new Date(blockStartTime).setHours(0, 0, 0, 0);
          const blockEndDay = new Date(blockEndTime).setHours(0, 0, 0, 0);

          // Eğer seçilen gün blok başlangıç gününe eşitse
          if (selectedDayStart === blockStartDay) {
            return {
              ...blockDate,
              startTime: blockDate.startTime,
              endTime:
                blockEndTime > selectedDayEnd
                  ? new Date(selectedDayEnd).toISOString()
                  : blockDate.endTime,
            };
          }

          // Eğer seçilen gün blok bitiş gününe eşitse
          if (selectedDayStart === blockEndDay) {
            return {
              ...blockDate,
              startTime:
                blockStartTime < selectedDayStart
                  ? new Date(selectedDayStart).toISOString()
                  : blockDate.startTime,
              endTime: blockDate.endTime,
            };
          }

          // Eğer aradaki herhangi bir günse (tam gün bloklanmış olacak)
          if (
            selectedDayStart > blockStartDay &&
            selectedDayStart < blockEndDay
          ) {
            return {
              ...blockDate,
              startTime: new Date(selectedDayStart).toISOString(),
              endTime: new Date(selectedDayEnd).toISOString(),
            };
          }

          return null;
        })
        .filter(Boolean);

      setFilteredBlockDates(blockDays);
    }
  }, [selectedDate, blockDates]);

  const generateTimeOptions = () => {
    const times = [];
    const now = convertToUserTime(new Date());
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const selectedDateTime = convertToUserTime(selectedDate);
    const isToday = moment(selectedDateTime).isSame(moment(now), "day");

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i < 10 ? `0${i}` : i;
        const minute = j < 10 ? `0${j}` : j;

        const time = `${hour}:${minute}`;
        const timeDate = moment(
          `${formatYearDate(selectedDate)}T${time}`
        ).toDate();

        const isBlocked = filteredBlockDates.some((blockDate) => {
          const blockStart = new Date(blockDate.startTime);
          const blockEnd = new Date(blockDate.endTime);
          return timeDate >= blockStart && timeDate <= blockEnd;
        });

        if (
          !isBlocked &&
          (!isToday ||
            i > currentHour ||
            (i === currentHour && j >= currentMinute))
        ) {
          times.push({ value: time, label: time });
        }
      }
    }

    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeChange = (setter, isStart) => (selectedOption) => {
    setter(selectedOption ? selectedOption.value : "");

    if (isStart && selectedOption) {
      const selectedTimeIndex = timeOptions.findIndex(
        (option) => option.value === selectedOption.value
      );
      const newFilteredOptions = timeOptions.slice(
        selectedTimeIndex + 1,
        selectedTimeIndex + 5
      );
      setFilteredTimeOptions(newFilteredOptions);
    }
  };

  const handleModal = async () => {
    const response = await MySwal.fire({
      title: "Do you confirm?",
      icon: "warning",
      html: `
      <p>${formatTime(selectedDate)}</p>
         <p><span>${time1}</span> - <span>${time2}</span></p>
         <p><span>( ${formattedTimeZone} ) </span><span>${tz}</span></p>
      `,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      showCancelButton: true,
      confirmButtonColor: "#EF6C00",
    });
    if (response.isConfirmed) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedDate || !time1 || !time2) {
        toast.error("Please select both start and end times.");
        return;
      }

      var fotmattedDatefromCard = formatYearDate(selectedDate);
      const startDateTime = moment.tz(
        `${fotmattedDatefromCard}T${time1}:00${gmtOffset}`,
        "UTC"
      );
      const endDateTime = moment.tz(
        `${fotmattedDatefromCard}T${time2}:00${gmtOffset}`,
        "UTC"
      );

      if (!startDateTime.isValid() || !endDateTime.isValid()) {
        toast.error("Invalid date or time selection.");
        return;
      }

      const submitData = {
        invitedUserIds: [userId],
        startTime: startDateTime,
        endTime: endDateTime,
      };

      const response = await client.post(
        "/ZoomMeeting/AddScheduledMeeting",
        submitData
      );

      if (response.status === 200) {
        toast.success(
          "The meeting request has been sent and is awaiting confirmation."
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error adding meeting:", error);
    }
  };

  function formatYearDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header
          closeButton
          className="d-flex flex-row align-items-start justify-content-between"
        >
          <Modal.Title>
            <div
              className="d-flex  flex-column text-start "
              style={{ paddingRight: 10 }}
            >
              <div>
                {userInfo?.firstName} {userInfo?.lastName}
              </div>
              <div className="mt-2">
                <p className="mb-0 " style={{ fontSize: 14 }}>
                  Registration: {formatTime(userInfo.registrationDate)}
                </p>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="Calendar"
            id="uncontrolled-tab-example"
            className="mb-3 tabs-with-full-line p-0"
          >
            <Tab
              className="account-settings-link user-profile-tab"
              eventKey="Calendar"
              title={
                <span>
                  <FontAwesomeIcon icon={faCalendar} /> Calendar
                </span>
              }
            >
              <div>
                <div className="text-center mb-4">
                  <h3 style={{ color: `#808080` }}>Schedule a Meeting</h3>
                </div>

                <DateSwiper
                  onDateSelect={(date) => {
                    setSelectedDate(formatYearDate(date));
                  }}
                  initialDate={initialSelectedDate}
                />

                <div style={{ margin: "40px 20px" }}>
                  <div className="d-flex  flex-column  flex-md-row justify-content-between align-items-md-end">
                    <div className="d-flex gap-3 justify-content-between">
                      <div style={{ width: 140 }}>
                        <div className="d-flex justify -content-between mb-3">
                          <label style={{ width: "100%" }}>Starts</label>
                          <Link
                            href={""}
                            type="button"
                            className="tooltip-btn-reschedule"
                            data-tooltip-id="my-tooltip-4"
                            data-place="top"
                          >
                            <span>i</span>
                          </Link>
                          <Tooltip id="my-tooltip-4" className="custom-tooltip">
                            <p>
                              Your chosen time zone (GMT{gmtOffset}) {tz}
                            </p>
                          </Tooltip>
                        </div>

                        <Select
                          className="talk-select"
                          options={timeOptions}
                          onChange={handleTimeChange(setTime1, true)}
                        />
                      </div>
                      <div style={{ width: 140 }}>
                        <div className="d-flex justify-content-between mb-3">
                          <label>Ends</label>
                          <Link
                            href={""}
                            type="button"
                            className="tooltip-btn-reschedule"
                            data-tooltip-id="my-tooltip-3"
                            data-place="top"
                          >
                            <span>i</span>
                          </Link>
                          <Tooltip id="my-tooltip-3" className="custom-tooltip">
                            <p>
                              Your chosen time zone (GMT{gmtOffset}) {tz}
                            </p>
                          </Tooltip>
                        </div>
                        <Select
                          className="talk-select"
                          options={filteredTimeOptions}
                          onChange={handleTimeChange(setTime2, false)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 schedule-modal-submit-main">
                      <label></label>
                      <InoButton
                        className=" schedule-modal-submit-btn"
                        width={120}
                        height={40}
                        title={"Submit"}
                        noOutline
                        onClick={handleModal}
                      />
                    </div>
                  </div>
                  <div id="block-dates" style={{ marginTop: "40px" }}>
                    {filteredBlockDates && filteredBlockDates.length > 0 ? (
                      <>
                        <div className="d-flex flex-column justify-content-between align-items-start">
                          <p className="fw-bold text-secondary">
                            Unavailable Times :
                          </p>
                          <div>
                            {filteredBlockDates.map((date, index) => (
                              <p key={index} className="mb-1 p-time">
                               {formatTime( date?.startTime, true)}
                                {" - "}
                                {formatTime( date?.endTime, true)}
                              </p>
                            ))}
                          </div>
                        </div>

                        <hr />
                      </>
                    ) : (
                      <p>This user is available for a meeting today.</p>
                    )}
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}
