// InoAccordion.jsx
"use client";
import Accordion from "react-bootstrap/Accordion";

const InoAccordion = ({title,description,eventKey, activeKey, setActiveKey}) => {
  return (
    <Accordion activeKey={activeKey} className="mb-5 mt-5">
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Header onClick={() => setActiveKey(activeKey !== eventKey ? eventKey : null)}>
          {title}
        </Accordion.Header>
        <Accordion.Body>
          {description}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default InoAccordion