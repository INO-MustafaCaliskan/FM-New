import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import client from "@/utils/client";
import { useUser } from "@/context/UserContext";
import InoButton from "../Buttons/InoButton";
import moment from "moment-timezone";
import MeetingCalendarModal from "./MeetingCalendarModal";
import CalendarDetailModal from "../Calendar/CalendarDetailModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import CalendarBlockModal from "../Calendar/CalendarBlockModal";
import useDateProcess from "@/utils/hooks/useDateProcess";
import "./style.css";

export default function Calendar() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [blockModalIsOpen, setBlockModalIsOpen] = useState(false);
  const [eventDetailsModalIsOpen, setEventDetailsModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apiTimeZone = user?.timeZone;
  const momentTimeZone = apiTimeZone || "UTC";
  const [refreshCalendar, setRefreshCalendar] = useState(false);

  const { timeOnly, toUserZone } = useDateProcess();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("/User/GetLoginUserCalendar/2");
        
        const data = response.data.data;

        const zoomMeetings = data.zoomMeetingCalendarDtos.filter((meeting) => meeting.zoomMeetingStatus !== 5).map((meeting) => {
          return {
            ftalkId: meeting.delegateFTalkId,
            title: `${"Meeting"} ${timeOnly(meeting.startTime)} - ${timeOnly(
              meeting.endTime
            )}`,
            start: toUserZone(meeting.startTime),
            end: toUserZone(meeting.endTime),
            extendedProps: {
              status: meeting.zoomMeetingStatusName,
              jobTitle: meeting.delegateJobTitleName,
              imageUrl: meeting.delegateImageUrl,
              isInviter: meeting.delegateIsInviter,
              delegateFirstName: meeting.delegateFirstName,
              delegateLastName: meeting.delegateLastName,
            },
            backgroundColor:
                meeting.zoomMeetingStatus === 5
                ? "red"
                : meeting.zoomMeetingStatus === 6
                ? "grey"
                : "#66C13B",
          };
        });
        const unavailableDates = data.userUnavailableDateCalendarDtos.map(
          (unavailable) => {
            return {
              id: unavailable.id,
              title: `${"Block"} ${timeOnly(
                unavailable.unavailableStartDate
              )}-${timeOnly(unavailable.unavailableEndDate)}`,
              titleInside: unavailable.title,
              start: toUserZone(unavailable.unavailableStartDate),
              end: toUserZone(unavailable.unavailableEndDate),

              description: unavailable.description,
              backgroundColor: "#fff",
              textColor: "#fff",
            };
          }
        );
        setEvents([...zoomMeetings, ...unavailableDates]);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchData();
  }, []);
  const renderBlockModal = () => {
    if (blockModalIsOpen) {
      return (
        <CalendarBlockModal
          show={blockModalIsOpen}
          onClose={() => setBlockModalIsOpen(false)}
          event={selectedEvent}
        />
      );
    }
    return null;
  };
  const handleDateClick = (arg) => {
    const clickedDate = moment(arg.dateStr).startOf("day");
    const today = moment().startOf("day");

    if (clickedDate.isBefore(today)) {
      toast.error("You can't select past date!");
      return;
    }

    setSelectedDate(arg.dateStr);

    setModalIsOpen(true);
  };
  const handleButtonClick = () => {
    const today = moment().format("YYYY-MM-DD");
    setSelectedDate(today);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeEventDetailsModal = () => {
    setEventDetailsModalIsOpen(false);
  };

  const handleRemoveBlock = async () => {
    try {
      const response = await client.get(
        "/UserUnavailableDates/RemoveAllLoginUserUnavailableDates"
      );
      if (response) {
        
        window.location.reload(); 
      } else {
        console.log("remove failed");
      }
    } catch (error) {
      console.log("Error Submitting Form : ", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const response = await client.post(
        "/UserUnavailableDates/SetUserUnavailableDates",
        data
      );
      
      if (response.data.success) {
        toast.success("success");
        setBlockModalIsOpen(false);
 
        setRefreshCalendar((prev) => !prev);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      ...info.event.extendedProps,
      start: info.event.start,
      end: info.event.end,
    };

    try {
      await client.post("/UserUnavailableDates/UpdateEventDates", updatedEvent);
      setEvents(
        events.map((event) =>
          event.id === info.event.id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error("Error updating event dates:", error);
      info.revert();
    }
  };

  const handleEventClick = (info) => {
    const isBlock = info.event.title.startsWith("Block");

    if (isBlock) {
      setSelectedEvent({
        id: info.event.id,
        title: info.event.title,
        titleInside: info.event.titleInside,
        description: info.event.description,
        start: info.event.start,
        end: info.event.end,
        ...info.event.extendedProps,
      });
      setBlockModalIsOpen(true);
    } else {
      setSelectedEvent({
        id: info.event.id,
        title: info.event.title,
        description: info.event.description,
        titleInside: info.event.titleInside,
        start: info.event.start,
        end: info.event.end,
        ...info.event.extendedProps,
      });
      setEventDetailsModalIsOpen(true);
    }
  };

  const handleModal = async () => {
    const response = await MySwal.fire({
      title: "Do you confirm removing all blocked times?",
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "#7CB342",
      showCancelButton: true,
      reverseButtons: true,
      customClass: {
        popup: 'custom-modal-width', 
        icon: 'custom-icon-color',   
      },
    });
    if (response.isConfirmed) {
      handleRemoveBlock();
    }
  };
  return (
    <div className="col calendar_page">
      <div className="row">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          editable={false}
          eventDrop={handleEventDrop}
          displayEventTime={false}
          displayEventEnd={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "blockButton",
          }}
          footerToolbar={{
            right: "removeAllButton",
          }}
          customButtons={{
            blockButton: {
              text: "Block My Time",
              click: handleButtonClick,
            },
            removeAllButton: {
              text: "Remove All Block",
              click: handleModal,
            },
          }}
          dayCellDidMount={(info) => {
            const today = moment().startOf("day");
            const cellDate = moment(info.date).startOf("day");

            if (cellDate.isBefore(today)) {
              info.el.style.backgroundColor = "#fafafa";
            }
          }}
          eventDidMount={(info) => {
            if (info.event.title.startsWith("Block")) {
              info.el.style.fontWeight = "bold";
              info.el.style.color = "#fff";
              info.el.style.border = "1px solid black !important";
              info.el.style.backgroundColor = "#ff4d5e";
            }
          }}
          eventClick={handleEventClick}
          viewDidMount={() => {
            const blockButton = document.querySelector(
              ".fc-blockButton-button"
            );
            const removeButton = document.querySelector(
              ".fc-removeAllButton-button"
            );
            if (blockButton) {
              blockButton.classList.add("block-button-custom");
            }
            if (removeButton) {
              removeButton.classList.add("block-button-custom");
            }
          }}
        />
        <MeetingCalendarModal
          show={modalIsOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          user={user}
          selectedDate={selectedDate}
          formattedDate={formattedDate}
          momentTimeZone={momentTimeZone}
        />
        <CalendarDetailModal
          show={eventDetailsModalIsOpen}
          onClose={closeEventDetailsModal}
          event={selectedEvent}
        />
        {renderBlockModal()}
      </div>
    </div>
  );
}
