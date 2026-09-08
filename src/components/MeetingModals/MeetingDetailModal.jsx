import React, { forwardRef, useState, useImperativeHandle } from "react";
import { Modal, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";

const MeetingDetailModal = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  useImperativeHandle(
    ref,
    () => ({
      close() {
        setShow(false);
      },
      open() {
        setShow(true);
      },
      isOpen() {
        return show;
      },
      setComponentData(data) {
        return new Promise((resolve, reject) => {
          try {
            if (!data.fTalkId) {
              const error = "Meeting does not exist.";
              toast.error(error, {
                theme: "colored"
              });
              
              this.close();
              return reject(error);
            }

            setData(data);
            this.open();
            resolve(true);
          } catch (error) {
            reject(error); // Hatanın reject edilmesi
          }
        });
      },
    }),
    []
  );
  return (
    <Modal show={show} onHide={() => ref.current.close()} dialogClassName="modal-dialog-centered">
      <Modal.Header closeButton>
        <Modal.Title>
          Meeting Information <i>({data.role})</i>
        </Modal.Title>
      </Modal.Header>
      <div className="bg-secondary p-3 d-flex justify-content-between text-white">
        <span>{data.category}</span>
        <span>FTalk ID: {data.fTalkId}</span>
      </div>
      <Modal.Body>
        <div className="row mb-3 text-center">
          <div className="col-md-4 meeting-history-image-card">
            <div className="ft-profile-image position-relative text-center" data-toggle="tooltip" title="busy">
              <Image src={data.imageUrl ?? ""} alt="" className="" width={100} height={100} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="meeting-history-card d-flex justify-content-between align-items-center">
              <div className="card-body">
                <h5 className="card-title">Meeting Date</h5>
                <p className="card-text">{data.meetingDate}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="meeting-history-card d-flex justify-content-between align-items-center">
              <div className="card-body">
                <h5 className="card-title">Meeting Status</h5>
                <p className="card-text">{data.meetingStatus}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-4">
            <div className="meeting-history-card d-flex justify-content-between align-items-center">
              <div className="card-body">
                <h5 className="card-title">{data.userFullName}</h5>
                <p className="card-text"></p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="meeting-history-card d-flex justify-content-between align-items-center">
              <div className="card-body">
                <h5 className="card-title">Start Time</h5>
                <p className="card-text">{data.startTime}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="meeting-history-card d-flex justify-content-between align-items-center">
              <div className="card-body">
                <h5 className="card-title">End Time</h5>
                <p className="card-text">{data.endTime}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => ref.current.close()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

MeetingDetailModal.displayName = "MeetingDetailModal";

export default MeetingDetailModal;
