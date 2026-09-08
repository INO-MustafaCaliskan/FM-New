import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import client from "@/utils/client";
import Select from "react-select";
import InoButton from "../Buttons/InoButton";
import "./ResheduleMeeting.css";
import useFormatDate from "@/utils/hooks/useFormatDate";
import DateSwiper from "../DateSwipper/DateSwipper";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import Cookies from "js-cookie";
import HumanizedDate from "../UI/HumanizedDate ";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MdTimer10 } from "react-icons/md";

const MySwal = withReactContent(Swal);
const tz = Cookies.get("timeZone") || "UTC ";
const convertToUserTime = (dateString) => {
  return toZonedTime(new Date(dateString), tz);
};
export default function RescheduleModal({
  show,
  handleClose,
  meeting,
  afterSubmit,
}) {
  const [userInfo, setUserInfo] = useState({});
  const [blockDates, setBlockDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredBlockDates, setFilteredBlockDates] = useState([]);
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const formatTime = useFormatDate();
  const { user } = useUser();
  const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);
  const apiTimeZone = user?.timeZone;
  const now = moment().tz(apiTimeZone);
  const gmtOffset = now?.format("Z");

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await client.get(
            `/User/GetOnlineNetworkerDetailById/${meeting?.delegateId}`
          );
          setUserInfo(response.data.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }

        try {
          const blockDatesResponse = await client.get(
            `/User/GetAllBlockedDates/${meeting?.delegateId}`
          );
          let unavailableDates = blockDatesResponse.data.data.map((dt) => ({
            ...dt,
            startTime: format(
              convertToUserTime(dt.startTime),
              "MMM d, yyyy HH:mm"
            ),
            endTime: format(convertToUserTime(dt.endTime), "MMM d, yyyy HH:mm"),
          }));

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
  }, [show, meeting]);

  useEffect(() => {
    if (show && meeting) {
      const startDateTime = toZonedTime(new Date(meeting.startTime), tz);
      const endDateTime = toZonedTime(new Date(meeting.endTime), tz);

      const formattedDate = startDateTime.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
      setTime1(format(startDateTime, "HH:mm"));
      setTime2(format(endDateTime, "HH:mm"));

      const allTimes = generateTimeOptions();
      const selectedTimeIndex = allTimes.findIndex(
        (option) => option.value === format(startDateTime, "HH:mm")
      );
      setFilteredTimeOptions(
        allTimes.slice(selectedTimeIndex + 1, selectedTimeIndex + 5)
      );
    }
  }, [show, meeting]);

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

  function formatYearDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const resetState = () => {
    setSelectedDate("");
    setTime1("");
    setTime2("");
    setFilteredTimeOptions([]);
  };

  const handleModalClose = () => {
    resetState();
    handleClose();
  };

  const generateTimeOptions = () => {
    const times = [];
    const now = convertToUserTime(new Date());
    const selectedDateTime = convertToUserTime(selectedDate);

    const isToday = moment(selectedDateTime).isSame(now, "day");

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i < 10 ? `0${i}` : i;
        const minute = j < 10 ? `0${j}` : j;

        const time = `${hour}:${minute}`;
        const timeDate = convertToUserTime(
          new Date(`${formatYearDate(selectedDate)}T${time}`)
        );
        const isPast = isToday && timeDate < now;

        if (!isPast) {
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
      <p>${format(selectedDate, "MMM dd, yyyy")}</p>
         <p><span>${time1}</span> - <span>${time2}</span></p>
         <p><span>( GMT${gmtOffset} ) </span><span>${tz}</span></p>
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
      const gmtOffset = moment.tz(tz).format("Z");
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const startDateTime = moment.tz(
        `${formattedDate}T${time1}:00${gmtOffset}`,
        "UTC"
      );
      const endDateTime = moment.tz(
        `${formattedDate}T${time2}:00${gmtOffset}`,
        "UTC"
      );

      const submitData = {
        id: meeting.id,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      const response = await client.post(
        "/ZoomMeeting/RescheduleMeeting",
        submitData
      );

      if (response.status === 200) {
        toast.success(
          "The meeting  reschedule request has been sent and is awaiting confirmation."
        );
        handleClose();
        afterSubmit();
      }
    } catch (error) {
      console.error("Error rescheduling meeting:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
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
                <h3 style={{ color: `#808080` }}>
                  Reschedule a Meeting-{" "}
                  {formatTime(meeting?.startTime, false, false, "yearOnly")}
                </h3>
              </div>

              <DateSwiper
                onDateSelect={(date) => {
                  resetState();
                  setSelectedDate(date);
                }}
                initialDate={meeting ? new Date(meeting.startTime) : new Date()}
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
                        value={
                          timeOptions.find(
                            (option) => option.value === time1
                          ) || null
                        }
                        onChange={handleTimeChange(setTime1, true)}
                        placeholder="Select..."
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
                        value={
                          filteredTimeOptions.find(
                            (option) => option.value === time2
                          ) || null
                        }
                        onChange={handleTimeChange(setTime2, false)}
                        placeholder="Select..."
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
                            <p key={index} className="mb-1">
                              {date?.startTime}
                              {" - "}
                              {date?.endTime}
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
  );
}
