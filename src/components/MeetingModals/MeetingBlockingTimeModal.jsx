import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@/context/UserContext";
import client from "@/utils/client";

const hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

const MeetingBlockingTimeModal = forwardRef((props, ref) => {
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useImperativeHandle(
    ref,
    () => {
      return {
        close() {
          setShow(false);
        },
        open() {
          setShow(true);
        },
        isOpen() {
          return show;
        },
        async blockTime() {
          debugger
          const payload = {
            id: "00000000-0000-0000-0000-000000000000",
            userId: user && user.id,
            title: "title",
            description: "description",
            unavailableStartDate: new Date().toISOString(),
            unavailableEndDate: new Date().toISOString(),
          };

          // api'ye post request atilacak
          await client.post("/UserUnavailableDates/SetUserUnavailableDates", payload).then((res) => {
            debugger;
          }).catch((err) => {
            debugger;
          })

          // notification gosterilecek
          this.close();
        },
        setComponentData(data) {
          return new Promise((resolve, reject) => {
            try {
              setData(data);
              this.open();
              resolve(true);
            } catch (error) {
              reject(error);
            }
          });
        },
      };
    },
    []
  );

  return (
    <Modal show={show} onHide={() => ref.current.close()} dialogClassName="modal-dialog-centered">
      <Modal.Header className="d-flex justify-content-between" closeButton>
        <Modal.Title className="w-100">Block My Time</Modal.Title>
        <b className="me-2">{data.startDatePretty}</b>
      </Modal.Header>
      <div className="bg-secondary p-3 d-flex justify-content-between text-white">
        <span>{data.userFullName}</span>
        <span>FTalk ID: {data.fTalkId}</span>
      </div>
      <Modal.Body className="px-4">
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Block My Time
              </label>
              <input type="text" name="title" value={title || ""} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="form-control" maxLength="30" style={{ height: "52px" }} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" placeholder="Descripton (optional)" className="form-control" maxLength="50"></textarea>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-12">
            <label htmlFor="eventperiod" className="form-label">
              Block Period
            </label>
            <select className="form-select" aria-label="eventperiod">
              <option selected="" value="0">
                Select Block Period
              </option>
              <option value="1">All Day</option>
              <option value="2">All Week</option>
              <option value="3">All Month</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="startdate" className="form-label">
                Starts
              </label>
              <input type="date" aria-label="startdate" className="form-control" id="inpStartDate" value={data.startDate || ""} />
            </div>
          </div>
          <div className="col-md-4 start-time-wrapper">
            <div className="col">
              <label>Time</label>
              <div className="meeting-timepicker active" data-type="end">
            <div className="timepicker-field">
                <span className="selected-item">
                    10:00
                </span>
                <FontAwesomeIcon icon={faClock} width={16} height={16} onClick={() => {}} />
            </div>
            <div className="meeting-timepicker-dropdown d-none">
                <div className="meeting-timepicker-dropdown-content">
                {hours.map((hour, i) => (
                    <div key={i}>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":00"}>
                          {hour + ":00"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":15"}>
                          {hour + ":15"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":30"}>
                          {hour + ":30"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":45"}>
                          {hour + ":45"}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="startdate" className="form-label">
                Ends
              </label>
              <input type="date" aria-label="startdate" className="form-control" id="inpStartDate" value={data.endDate || ""} />
            </div>
          </div>
          <div className="col-md-4 start-time-wrapper">
          <div className="col">
        <label>Time</label>
        <div className="meeting-timepicker active" data-type="end">
            <div className="timepicker-field">
                <span className="selected-item">
                    10:00
                </span>
                <FontAwesomeIcon icon={faClock} width={16} height={16} onClick={() => {}} />
            </div>
            <div className="meeting-timepicker-dropdown d-none">
                <div className="meeting-timepicker-dropdown-content">
                {hours.map((hour, i) => (
                    <div key={i}>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":00"}>
                          {hour + ":00"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":15"}>
                          {hour + ":15"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":30"}>
                          {hour + ":30"}
                      </div>
                      <div className="meeting-timepicker-item" data-key={i} data-type="end" data-time={hour + ":45"}>
                          {hour + ":45"}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => ref.current.blockTime()}>
          Block
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

MeetingBlockingTimeModal.displayName = "MeetingBlockingTimeModal";

export default MeetingBlockingTimeModal;
