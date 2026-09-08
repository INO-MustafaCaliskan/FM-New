import React, { memo } from "react";
import HumanizedDate from "../UI/HumanizedDate ";
import { faCheck, faCheckDouble, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFormatDate from "@/utils/hooks/useFormatDate";
import { Dropdown } from 'react-bootstrap'
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";

const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;

const MessageBubble = ({id, text, date, isMyMessage, attachments, isRead, readDate, onMessageRevoke}) => {
  const formatDate = useFormatDate();

  const getAttachmentName = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  const createMessageContent = () => {
    // frontend tek attachment olabilir şeklinde tasarlandı ancak backend çoklu attachementa izin veriyor. 
    // hem mesaj göndereiblir hem de attachment eklenebilir yapı backendde var. ancak şimdilik kullanmıyoruz.
    if(attachments == null || attachments.length === 0){

      const parts = [];
      let lastIndex = 0;

      const matches = Array.from(text.matchAll(URL_REGEX));

      if(matches.length === 0)
        return <p className={`${isMyMessage ? 'me' : 'your'}-msg-content msg mb-0`}>{text}</p>

      matches.forEach((match) => {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        if (matchStart > lastIndex) {
          parts.push({
            type: "text",
            content: text.substring(lastIndex, matchStart),
          });
        }

        parts.push({
          type: "link",
          content: match[0],
        });

        lastIndex = matchEnd;
      });

      if (lastIndex < text.length) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex),
        });
      }
      
      const textContent =  parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === "link") {
          return (
            <a key={index} href={part.content} target="_blank" rel="noreferrer" className="linkText">
              {part.content}
            </a>
          );
        }
      });

      return <p className={`${isMyMessage ? 'me' : 'your'}-msg-content msg mb-0`}>{textContent}</p>
    }

    const att = attachments[0];
    const contentType = att.type;
    // contentType 0: image, 1: video, 2: audio, 3: document
    const extension = att.url.split('.').pop().toUpperCase();

    if(contentType === 1){
      return (
        <div className="msg d-flex flex-row align-items-center gap-2 text-dark">
          <a href={att.url} download={text} target='_blank' rel="noreferrer">
            <FontAwesomeIcon size="24" icon={faDownload} />
          </a>
          <div className="d-flex flex-column align-items-start attached-image-wrapper">
            <img src={att.url} className="attached-image" alt="image"/>
            <a href={att.url} target="_blank" rel="noreferrer">{getAttachmentName(att.url)}</a>
          </div>

        </div>
      )
    }else if(contentType === 4){
      return (
        <div className="msg d-flex flex-row align-items-center gap-2 text-dark" title="Download File">
          <a href={att.url} download={att.url} target='_blank' rel="noreferrer">
            <div className="d-flex flex-column align-items-center">
              <FiFileText size={24} />
              <small className="fw-bold">{extension}</small>
            </div>
          </a>
          <div className="d-flex flex-column attached-file-wrapper">
            <a href={att.url} className="text-decoration-underline" target="_blank" rel="noreferrer">{getAttachmentName(att.url)}</a>
          </div>
          
        </div>
      )
    }else{
      console.warn("Unsupported attachment type: ", contentType);
      return <p className={`${isMyMessage ? 'me' : 'your'}-msg-content msg mb-0`}>{text || att.url}</p>
    }
  }

  return (
    <div className={`msg-container ${isMyMessage ? "msg-self" : "msg-remote"}`} >
      <div className={`d-flex ${isMyMessage ? 'flex-row' : 'flex-row-reverse'} justify-content-end align-items-center`}>
        {
          isMyMessage &&  <Dropdown className="chat-message-dropdown">
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <BiDotsVerticalRounded size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="start">
                                <Dropdown.Item key="revoke" eventKey="revoke" onClick={() => onMessageRevoke && onMessageRevoke(id)}>Delete Message</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
        }


        <div className="msg-box mb-1">
          {
              createMessageContent()
          }
        </div>
      </div>
        <div className={`w-100 d-flex ${isMyMessage ? 'justify-content-end' : ''}`}>
          <div className="col-auto">
              <span>
                <HumanizedDate className="connect-360-last-seen me-1" dateString={date} showHours={true} />
                {
                  isMyMessage &&
                  (
                      isRead
                      ? <FontAwesomeIcon icon={faCheckDouble} color="blue" title={`Seen ${formatDate(readDate, true)}`} />
                      : <FontAwesomeIcon icon={faCheck} color="gray" title="Sent" />
                  )
                }
              </span>
          </div>
        </div>          
    </div>
  );
};

export default memo(MessageBubble);

const RevokedBox = ({isMyMessage}) => {
  return (
    <div className={`msg-container revoked ${isMyMessage ? "msg-self" : "msg-remote"}`} >
      <div className="msg-box mb-1 revoked-msg-box">
        <p className={`${isMyMessage ? 'me' : 'your'}-msg-content msg mb-0 fst-italic text-muted`}>This message was deleted by sender.</p>
      </div>
    </div>
  );
}

export const RevokedMessageBox = memo(RevokedBox);