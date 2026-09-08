"use client";
import { Modal, Button } from "react-bootstrap";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import useDateProcess from "@/utils/hooks/useDateProcess";



const CalendarDetailModal = ({ show, onClose, event }) => {

  const {timeOnly,dateOnly}=useDateProcess()

  const userInfo = useUser();
  let user = userInfo.user;
  


  return (
    <>
      <Modal show={show} onHide={onClose} id="divMeetingCalendar">
        <Modal.Header closeButton className="d-flex justify-content-between">
          <Modal.Title id="modalIdLabel">
            Meeting Information{" "}
            <span style={{ fontSize: "small", fontStyle: "italic" }}>
              ({event?.isInviter ? "Inviter" : "Invitee"})
            </span>
          </Modal.Title>
        </Modal.Header>
        <div className="meeting-head d-flex justify-content-between">
          <div className="title-head-left">
            <h6>{event?.jobTitle}</h6>
          </div>
          <div className="title-head-right">
            <h6>FTalk ID: {event?.ftalkId}</h6>
          </div>
        </div>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-4 meeting-history-image-card text-center">
              <div
                className="ft-profile-image position-relative"
                data-toggle="tooltip"
                title="busy"
              >
                <Image
                  src={event?.imageUrl || "/images/empty-image.png"}
                  alt="emty-image"
                  className="img-fluid rounded"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="meeting-history-card d-flex">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title">Meeting Date</h5>
                  <p className="card-text">{dateOnly(event?.start.toISOString())}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="meeting-history-card d-flex">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title">Meeting Status</h5>
                  <p className="card-text">{event?.status}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="meeting-history-card d-flex">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title text-wrap text-center">{`${event?.delegateFirstName} ${event?.delegateLastName}`}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="meeting-history-card d-flex">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title">Start Time</h5>
                  <p className="card-text" id="dataStartTimeText">
                  {timeOnly(event?.start.toISOString())}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="meeting-history-card d-flex">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title">End Time</h5>
                  <p className="card-text" id="dataEndTimeText">
                  {timeOnly(event?.end.toISOString())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalendarDetailModal;