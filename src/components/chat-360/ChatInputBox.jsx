import { useRef, useState } from "react"
import { useSignalR } from "@/context/SignalRContext2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import useUploadFile from "@/utils/hooks/useUploadFile";
import { EmojiSelect } from "../UI/EmojiSelect";
import getMediaTypeEnumValue from "@/utils/getMediaTypeEnumValue";

export const ChatInputBox = () => {
    const textAreaRef = useRef(null);
    const {uploadFileHelper} = useUploadFile();
    const {
        sendMessage,
        activeConversation
      } = useSignalR();

    const [message, setMessage] = useState("")
    const [attachment, setAttachment] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = (e) => {
        if(e.target.files.length > 0){
            setAttachment({
                file : e.target.files[0],
                type : getMediaTypeEnumValue(e.target.files[0].type)
            });
        }
        e.target.value = "";
    };

    const handleImageChange = (e) => {
        if(e.target.files.length > 0){
            setAttachment({
                file : e.target.files[0],
                type : getMediaTypeEnumValue(e.target.files[0].type)
            });
        }
        e.target.value = "";
    };

    const removeAttachment = () => {
        setAttachment(null);
    }

    const sendMessageHandler = async() => {
        if(!attachment)
            await sendTextMessageHandler();
        else
            await sendAttachmentHandler();
    }

    const sendTextMessageHandler = async () => {
        if(message){
            await sendMessage(activeConversation, message, null)
            setMessage("")
        }
    }

    const textAreaKeyHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessageHandler();
        }
    }

    const sendAttachmentHandler = async () => {
        if(!attachment)
            return;

        setIsUploading(true);

        const uploadData = await uploadFileHelper(attachment.file, "chat");
        if(uploadData.success){
            const attachmentInfo = {
                url : uploadData.data.fullPath,
                type : getMediaTypeEnumValue(uploadData.data.format),
                width : uploadData.data.width,
                height : uploadData.data.height,
                format : uploadData.data.format
            }
            await sendMessage(activeConversation, message, attachmentInfo);
            setMessage("")
            setAttachment(null);
        }

        setIsUploading(false);
    }
    
    const onEmojiClick = (emojiData) => {
        const cursorPosition = textAreaRef.current?.selectionStart;
        const newVal = message.slice(0, cursorPosition) + emojiData.emoji + message.slice(cursorPosition);
        setMessage(newVal);
        textAreaRef.current?.focus();
    }

  return (
    <div className="recent-chat-message-input-field">
    <div className="row">
        <div className="col-lg-8 position-relative lead emoji-picker-container quick-chat-wrapper lead">
            {
                attachment && (
                    <div className="chat-file-preview d-flex justify-content-between">
                        <span>{attachment.file.name}</span>
                        <FontAwesomeIcon icon={faTimes} onClick={removeAttachment} className="chat-file-remove-icon" />
                    </div>
                )
            }
        <textarea 
            ref={textAreaRef}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => textAreaKeyHandler(e) }
             value={message} placeholder="Let's Chat!" className="chat-input" name="quick-message-text" data-type="original-input"></textarea>
            <Link className="connect-360-mobile-send-btn" href="#">
                <Image src="/images/send-button.svg" width={32} height={32} alt="send-button"/>
            </Link>
        </div>
        <div className="col-auto chat-action-wrapper">
            <div className="d-flex me-4 gap-2">
                <EmojiSelect onEmojiClick={onEmojiClick} />
                <div className="d-flex align-items-center">
                    <input onInput={handleFileChange} data-type="attach" className="d-none" type="file" name="chat-attach" accept="application/pdf,application/vnd.ms-excel" id="chat-attach" />
                    <label htmlFor="chat-attach">
                        <Image src="/images/attach.png" width={32} height={32} alt="attach-image" />
                    </label>
                </div>
                <div className="d-flex align-items-center">
                    <input onInput={handleImageChange} data-type="image" className="d-none" accept="image/png, image/gif, image/jpeg, image/jpg" type="file" name="chat-image" id="chat-image" />
                    <label htmlFor="chat-image">
                        <Image src="/images/add-photo.png"  width={32} height={32} alt="attach-image" />
                    </label>
                </div>
                <div>
                    {isUploading 
                        ? <CircularProgress size={32} />
                        : <button onClick={sendMessageHandler} className="connect-360-desktop-send-btn">
                            <Image src="/images/send-button.svg"width={32} height={32}  alt="send-button"/>
                        </button>
                    }
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
