import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import InoButton from "../Buttons/InoButton";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useFormatDate from "@/utils/hooks/useFormatDate";

const MySwal = withReactContent(Swal);
const formatDate = useFormatDate();
const MeetingCalendarModal = ({
  show,
  onClose,
  onSubmit,
  user,
  selectedDate,
  formattedDate,
  momentTimeZone,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    title: "",
    description: "",
    unavailableStartDate: "",
    unavailableEndDate: "",
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:15");
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [blockPeriod, setBlockPeriod] = useState("");
  const [blockPeriodName, setBlockPeriodName] = useState("this period");

  const [isDateAndTimeDisabled, setIsDateAndTimeDisabled] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, userId: user.id });
    }
  }, [user]);
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);
  useEffect(() => {
    setStartDate(selectedDate);
    setEndDate(selectedDate);
  }, [selectedDate]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    options.push("23:59");
    return options;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlockPeriodChange = (e) => {
    const value = e.target.value;
    setBlockPeriod(value);

    if (value === "1") {
      const sameDay = moment(startDate).format("YYYY-MM-DD");
      setEndDate(sameDay);
      setBlockPeriodName("all day");
    } else if (value === "2") {
      const nextWeek = moment(startDate)
        .add(1, "week")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      setEndDate(nextWeek);
      setBlockPeriodName("all week");
    } else if (value === "3") {
      const nextMonth = moment(startDate)
        .add(1, "month")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      setEndDate(nextMonth);
      setBlockPeriodName("all month");
    } else if (value === "0") {
      setEndDate(startDate);
      setEndTime("00:15");
      setIsDateAndTimeDisabled(false);
      setBlockPeriodName("this period");
    }
    if (value !== "0") {
      const today = moment().format("YYYY-MM-DD");

      let newStartTime = "00:00";

      
      if (startDate === today) {
        newStartTime = moment().format("HH:mm");
      }

      setStartTime(newStartTime);
      setEndTime("23:59");
      setIsDateAndTimeDisabled(true);
    }
  };
  const resetForm = () => {
    setFormData({
      id: "",
      userId: user?.id || "",
      title: "",
      description: "",
      unavailableStartDate: "",
      unavailableEndDate: "",
    });
    setStartDate(selectedDate);
    setEndDate(selectedDate);
    setStartTime("00:00");
    setEndTime("00:15");
    setBlockPeriod("");
    setBlockPeriodName("this period");
    setIsDateAndTimeDisabled(false);
  };
  const handleModal = async () => {
    const response = await MySwal.fire({
      title: `Do you confirm to block ${blockPeriodName}?`,
      text: `${startDate} ${startTime} - ${endDate} ${endTime}`,
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "#7CB342",
      showCancelButton: true,
      reverseButtons: true,
      customClass: {
        popup: "custom-modal-width",
        icon: "custom-icon-color",
      },
    });
    if (response.isConfirmed) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const startDateTime = moment.tz(
      `${startDate}T${startTime}:00`,
      momentTimeZone,
    );
    const endDateTime = moment.tz(`${endDate}T${endTime}:00`, momentTimeZone);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      console.error("Invalid date");
      return;
    }

    const utcStartDateTime = startDateTime
      .clone()
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const utcEndDateTime = endDateTime
      .clone()
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const data = {
      userId: formData.userId,
      title: formData.title,
      description: formData.description,
      unavailableStartDate: utcStartDateTime,
      unavailableEndDate: utcEndDateTime,
    };

    onSubmit(data);
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title>Block My Time</Modal.Title>
        <Modal.Title>{formattedDate}</Modal.Title>
      </Modal.Header>
      <div>
        <div className="meeting-head">
          <div className="title-head">
            <h6>
              <b>{user?.firstName + " " + user?.lastName}</b>
            </h6>
          </div>
          <div>
            <h6>
              <b>FTalk ID:{user?.fTalkId}</b>
            </h6>
          </div>
        </div>
      </div>
      <Modal.Body>
        <Form className="px-1">
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="formTitle">Block Period</Form.Label>
            <Form.Select
              aria-label="Default select example"
              id="formTitle"
              value={blockPeriod}
              onChange={handleBlockPeriodChange}
            >
              <option value="0">Select Block Period</option>
              <option value="1">All Day</option>
              <option value="2">All Week</option>
              <option value="3">All Month</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Group className="col-7 col-md-8" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isDateAndTimeDisabled}
              />
            </Form.Group>
            <Form.Group className="col-4 col-md-3" controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                className="talk-select"
                as="select"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isDateAndTimeDisabled}
              >
                {generateTimeOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <Form.Group className="col-7 col-md-8" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isDateAndTimeDisabled}
              />
            </Form.Group>

            <Form.Group className="col-4 col-md-3" controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                className="talk-select"
                as="select"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isDateAndTimeDisabled}
              >
                {generateTimeOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <InoButton
              type="button"
              title="Save Changes"
              className="btn-primary"
              onClick={handleModal}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MeetingCalendarModal;
