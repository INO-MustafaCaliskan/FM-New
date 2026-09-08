import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const ConfirmationModal = ({
  showModal,
  handleClose,
  handleSubmit,
  confirmationCode,
  setConfirmationCode,
  loading
}) => {
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title id="contained-modal-title-vcenter">
          Reset Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mt-3">A confirmation code has been sent to the relevant e-mail address.</p>
        <Form>
          <Form.Group>
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              className="talk-form-control"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </Form.Group>
        </Form>
           <Button
          className="talk-button mt-5"
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              CONFIRM
            </>
          ) : (
            "CONFIRM"
          )}
        </Button>
      </Modal.Body>
   
     

    </Modal>
  );
};

export default ConfirmationModal;
