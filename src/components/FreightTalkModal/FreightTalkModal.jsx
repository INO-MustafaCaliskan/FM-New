"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { useEffect , useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function FreightTalkModal() {
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const cookie = Cookies.get("freight-talk-beta-accept");
    if (cookie == null || cookie == false) {
      setModalVisible(true);
    }
  }, []);

  const handleCookieAccept = () => {
    setModalVisible(false);
    Cookies.set("freight-talk-beta-accept", true, {
      expires: 7,
    });
  };
  return (
    <>
      {isModalVisible && (
        <div className="talk-overlay">
          <div className="talk-modal ">
            <div className="modal-dialog modal-dialog-centered">
              <div className="talk-modal-content">
                <div className="talk-modal-header">
                  <h5 className="modal-title">Freight Talk Beta!</h5>
                  <button className="talk-modal-close-btn" onClick={handleCookieAccept}>
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                <div className="talk-modal-body">
                  <p className="beta-notice-modal-content-text">
                    Congratulations and welcome to the Freight Talk Beta
                    Version! You are one of the pioneers. The purpose of this
                    beta version is to refine our platform based on your
                    invaluable feedback. During this period, we hope you
                    experience the many benefits and advantages of our platform.
                    Please feel free to share your comments and suggestions, and
                    if possible, accompany them with screenshots. You can reach
                    us through our contact form or via email at{" "}
                    <Link href="mailto:hello@freighttalk.com">
                      hello@freighttalk.com
                    </Link>
                    .
                  </p>
                </div>
                <div className="modal-footer">
                  <Button
                    data-bs-dismiss="modal"
                    className="notice-redirect btn btn-primary"
                    onClick={handleCookieAccept}
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
