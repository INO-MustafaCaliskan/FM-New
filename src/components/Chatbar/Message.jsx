import HumanizedDate from '../UI/HumanizedDate '
import { faCheck, faCheckDouble, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo } from 'react'
import { Dropdown } from 'react-bootstrap'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { FiFileText } from 'react-icons/fi'

const URL_REGEXX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;

export const Message = ({message ,isPartnerMessage, dateFormatter, onMessageRevoke}) => {
      const getAttachmentName = (url) => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      }
    
      const CreateMessageContent = () => {
        if(message.attachments == null || message.attachments.length === 0){
                const parts = [];
      let lastIndex = 0;

      const matches = Array.from(message.message.matchAll(URL_REGEXX));

      if(matches.length === 0)
        return <div className={`message-box ${isPartnerMessage ? 'message-partner' : ''}`}>
                {message.message}
            </div>

      matches.forEach((match) => {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        if (matchStart > lastIndex) {
          parts.push({
            type: "text",
            content: message.message.substring(lastIndex, matchStart),
          });
        }

        parts.push({
          type: "link",
          content: match[0],
        });

        lastIndex = matchEnd;
      });

      if (lastIndex < message.message.length) {
        parts.push({
          type: "text",
          content: message.message.substring(lastIndex),
        });
      }

            const textContent =  parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === "link") {
          return (
            <a key={index} href={part.content} target="_blank" rel="noreferrer" className="text-decoration-underline">
              {part.content}
            </a>
          );
        }
      });
          return <div className={`message-box ${isPartnerMessage ? 'message-partner' : ''}`}>
                {textContent}
            </div>
        }

        const attachment = message.attachments[0];
        const contentType = attachment.type;
        // contentType 0: image, 1: video, 2: audio, 3: document
        const extension = attachment.url.split('.').pop().toUpperCase();

        if(contentType === 1){
          return (
            <div className={`message-box ${isPartnerMessage ? 'message-partner' : ''}`}>
                <div className="d-flex flex-row align-items-center gap-2">
                    <a href={attachment.url} download={attachment.url} target='_blank' rel="noreferrer">
                        <FontAwesomeIcon size="24" icon={faDownload} />
                    </a>
                    <div className="d-flex flex-column align-items-start">
                        <img className='attached-img' src={attachment.url} alt="image" />
                        <a href={attachment.url} target="_blank" rel="noreferrer" style={{width : '80%', wordBreak : 'break-all'}}>{getAttachmentName(attachment.url)}</a>
                    </div>
                </div>
            </div>
          )
        }else if(contentType === 4){
          return (
            <div className={`message-box ${isPartnerMessage ? 'message-partner' : ''}`}>
                <div className="d-flex flex-row align-items-center gap-2">
                    <a href={attachment.url} download={attachment.url} target='_blank' rel="noreferrer">
            <div className="d-flex flex-column align-items-center">
              <FiFileText size={24} />
              <small className="fw-bold">{extension}</small>
            </div>
                  </a>
                    <div className="d-flex flex-column">
                  <a href={attachment.url} target="_blank" rel="noreferrer" style={{wordBreak : 'break-all', textDecoration : 'underline'}}>{getAttachmentName(attachment.url)}</a>
                  </div>
                </div>
            </div>
          )
        }else{
          console.warn("Unsupported attachment type: ", contentType);
          return <div className={`message-box ${isPartnerMessage ? 'message-partner' : ''}`}>
                {message.message || attachment.url}
            </div>
        }
      }


  return (
    <div className={`message-box-holder ${isPartnerMessage ? 'partner' : ''}`}>
      {
        isPartnerMessage
        ? <CreateMessageContent />
        : <div className='d-flex justify-content-end'>
            {
              !isPartnerMessage && <Dropdown className="chat-message-dropdown">
                                      <Dropdown.Toggle variant="link" id="dropdown-basic">
                                          <BiDotsVerticalRounded size={20} />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu align="start">
                                          <Dropdown.Item key="revoke" eventKey="revoke" onClick={() => onMessageRevoke && onMessageRevoke(message.id)}>Delete Message</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
            }
            <CreateMessageContent />
          </div>
      }
        <small className="message-info">
          <HumanizedDate dateString={message.createdDate} showHours={true} className="me-1" />
          {
              !isPartnerMessage &&
              (
                  message.status === 1
                  ? <FontAwesomeIcon icon={faCheck} color="gray" title="Sent" />
                  : <FontAwesomeIcon icon={faCheckDouble} color="blue" title={`Seen ${dateFormatter(message.viewedDate, true)}`} />
              )
          }
        </small>
    </div>
  )
}



const RevokedMessage = ({isPartnerMessage}) => {
  return (
    <div className={`message-box-holder ${isPartnerMessage ? 'partner' : ''}`}>
        <div className={`message-box revoked ${isPartnerMessage ? 'message-partner' : ''}`}>
            This message was deleted by sender.
        </div>
    </div>
  );
}

export const RevokedMessageBox = memo(RevokedMessage);