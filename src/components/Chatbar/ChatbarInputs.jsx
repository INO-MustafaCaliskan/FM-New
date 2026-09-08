import React, { useRef, useState } from "react";
import { useSignalR } from "@/context/SignalRContext2";
import { AttachmentInfo } from "./AttachmentInfo";
import { CircularProgress } from "@mui/material";
import { debounce } from 'lodash';
import useUploadFile from "@/utils/hooks/useUploadFile";
import { toast } from "react-toastify";
import { EmojiSelect } from "../UI/EmojiSelect";
import getMediaTypeEnumValue from "@/utils/getMediaTypeEnumValue";

export const ChatbarInputs = ({ userId }) => {
  const textAreaRef = useRef(null);
  const { uploadFileHelper } = useUploadFile();
  const { sendMessage } = useSignalR();

  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachment({
        file: e.target.files[0],
        type: 3,
      });
    }
    e.target.value = "";
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachment({
        file: e.target.files[0],
        type: 2,
      });
    }
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const sendMessageHandler = async (e) => {
    e?.preventDefault();
    if (!attachment) sendTextMessageHandler();
    else await sendAttachmentHandler();
  };

  const sendTextMessageHandler = () => {
    if (message) {
      sendMessage(userId, message, null);
      setMessage("");
    }
  };

  const textAreaKeyHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageHandler(e);
    }
  };

  const sendAttachmentHandler = async () => {
    const uploadData = await uploadFile(attachment.file);
    
    if(uploadData){
      await sendMessage(
        userId,
        message,
        uploadData
      );
      setMessage("");
      setAttachment(null);
    }else{
      toast.error("Error uploading file");
    }

  };

  const uploadFile = async (file) => {
    if (!attachment) return;
    setIsUploading(true);

    const result = await uploadFileHelper(file, "chat");
    if (result.success) {
      setIsUploading(false);

      const attachmentInfo = {
          url : result.data.fullPath,
          type : getMediaTypeEnumValue(result.data.format),
          width : result.data.width,
          height : result.data.height,
          format : result.data.format
      }

      return attachmentInfo;
    }
    
    setIsUploading(false);
  };

  const onEmojiClick = (emojiData) => {
    const cursorPosition = textAreaRef.current?.selectionStart;
    const newVal = message.slice(0, cursorPosition) + emojiData.emoji + message.slice(cursorPosition);
    setMessage(newVal);
    textAreaRef.current?.focus();
}

  return (
    <>
      {attachment && (
        <AttachmentInfo file={attachment.file} onRemove={removeAttachment} />
      )}
      <div className="message-field d-flex flex-row gap-2">
        <div className="quick-chat-wrapper">
          <textarea
            ref={textAreaRef}
            disabled={attachment}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => textAreaKeyHandler(e)}
            type="text"
            placeholder="Let's Chat!"
            className="chat-input"
            name="quick-message-text"
            autoComplete="off"
            data-emojiable="true"
            rows={1}
          />
        </div>
        <div className="quick-chat-action-wrapper d-flex flex-row align-items-center">
          <span className="input-action">
            <input
              onInput={handleFileChange}
              className="d-none chat-attach"
              type="file"
              data-type="attach"
              name="chat-attach"
              accept="application/pdf,application/vnd.ms-excel"
              id={`chat-attach-${userId}`}
            />
            <label htmlFor={`chat-attach-${userId}`}>
              <img alt="attach file" src="/images/attach.png" />
            </label>
          </span>
          <span className="input-action">
            <input
              onInput={handleImageChange}
              className="d-none"
              accept="image/png, image/gif, image/jpeg, image/jpg"
              type="file"
              data-type="image"
              name="chat-image"
              id={`chat-image-${userId}`}
            />
            <label htmlFor={`chat-image-${userId}`}>
              <img alt="add photo" src="/images/add-photo.png" />
            </label>
          </span>
          <span className="input-action">
            <EmojiSelect onEmojiClick={onEmojiClick} />
          </span>
          <span className="input-action">
            {isUploading 
              ? <CircularProgress size={20} />
              : <button type="button" onClick={sendMessageHandler} >
                   <img alt="send button" src="/images/send-button.svg" />
                </button>
            }
          </span>
        </div>
      </div>
    </>
  );
};
