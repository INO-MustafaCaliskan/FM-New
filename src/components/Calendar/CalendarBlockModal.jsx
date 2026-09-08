import { Modal, Button } from "react-bootstrap";
import moment from "moment-timezone";
import { useUser } from "@/context/UserContext";
import { Form } from "react-bootstrap";
import InoButton from "../Buttons/InoButton";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import client from "@/utils/client";
import useDateProcess from "@/utils/hooks/useDateProcess";


const MySwal = withReactContent(Swal);

const CalendarDetailModal = ({ show, onClose, event }) => {
  const {inoFormat,timeOnly}=useDateProcess()
  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  };
 
  const handleUnBlock = async () => {
    try {
      const response = await client.get(
        `UserUnavailableDates/Delete/${event.id}`
      );
      window.location.reload(); 
    } catch {}
  };
  const userInfo = useUser();
  let user = userInfo.user;

  const handleModal = async () => {
    const response = await MySwal.fire({
      title: "Do you confirm to unblock?",
      text: `${inoFormat(event?.start.toISOString())} - ${inoFormat(event?.end.toISOString())}`,
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
      handleUnBlock();
    }
  };
  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>Unblock My Time</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={onClose} />
        </Modal.Header>
        <div>
          <div className="meeting-head">
            <div className="title-head">
              <h6>
                <b>{user.firstName + " " + user.lastName}</b>
              </h6>
            </div>
            <div>
              <h6>
                <b>FTalk ID:{user.fTalkId}</b>
              </h6>
            </div>
          </div>
        </div>
        <Modal.Body className="p-4 ">
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control  className="talk-form-control"  value={event.titleInside} type="text" name="title" disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea"  value={event.description} name="description" disabled />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Group
                className="mb-3"
                controlId="formStartDate"
                style={{ width: "70%" }}
              >
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formatDate(event.start).split(" ")[0]}
                  disabled
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formStartTime"
                style={{ width: "25%" }}
              >
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  className="talk-form-control"
                  type="text"
                  value={timeOnly(event?.start.toISOString())}
                  name="startTime"
                  disabled
                ></Form.Control>
              </Form.Group>
            </div>
            <div className="d-flex justify-content-between ">
              <Form.Group
                className="mb-3"
                controlId="formEndDate"
                style={{ width: "70%" }}
              >
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formatDate(event.end).split(" ")[0]}
                  disabled
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="formEndTime"
                style={{ width: "25%" }}
              >
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  className="talk-form-control"
                  type="text"
                  value={timeOnly(event?.end.toISOString())}
                  name="endTime"
                  disabled
                ></Form.Control>
              </Form.Group>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-5">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <InoButton
                type="button"
                title="Unblock"
                className="btn-primary"
                onClick={handleModal}
              />
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarDetailModal;
