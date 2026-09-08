import React from "react";
import { Modal } from "react-bootstrap";
import InoButton from "../Buttons/InoButton";
import "./CancelMeetingModal.css";

export default function CancelMeetingModal({
    show,
    handleClose,
    handleConfirm,
    loading,
}) {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby="cancel-modal-title"
            centered
            className="cancel-meeting-modal"
        >
            <Modal.Header >
                <Modal.Title id="cancel-modal-title">Cancel Meeting Request ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to cancel the meeting request? If you cancel the
                    request, the other party will be notified.
                </p>
            </Modal.Body>
            <Modal.Footer className="cancel-modal-footer">
                <InoButton
                    title="Keep Request"
                    width={150}
                    height={32}
                    isOutline
                    disabled={loading}
                    onClick={handleClose}
                />
                <InoButton
                    title="Cancel Request"
                    width={150}
                    height={32}
                    red
                    disabled={loading}
                    onClick={handleConfirm}
                    className="cancel-request-btn"
                />
            </Modal.Footer>
        </Modal>
    );
}
