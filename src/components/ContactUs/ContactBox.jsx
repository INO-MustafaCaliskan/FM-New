import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoMail } from "react-icons/io5";
const ContactBox = ({ element,text, icon, iconSize, title, subtitle, iconColor, cardTitle, addressInfo }) => {
  return (
    <div className=" mt-3">
      <div className="contact-box ">
        <IoMail
          icon={icon}
          fontSize={iconSize}
          className="icon-box rounded"
          style={{
            backgroundColor: iconColor,
            padding: "15px"
          }}
        />
        <div className="d-flex flex-column">
          <div>
            <p className="text-muted">{cardTitle}</p>
          </div>
          <div>
            {title && <p className="fw-bold mt-2">{title}</p>}
            {subtitle && <p className="text-muted">{subtitle}</p>}
            {<p className="mt-1" style={{ textAlign: 'justify' }}>{text}</p>}
            {<p className="">{addressInfo}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBox;