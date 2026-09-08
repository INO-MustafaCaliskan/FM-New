import { faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const AttachmentInfo = ({file, onRemove}) => {
    const MB = 1024 * 1024; // 1 MB = 1,048,576 bytes
    const sizeInMB = file.size / MB;
    const formattedSize = sizeInMB.toFixed(2); // Yuvarlama ve formatlama

  return (
    <div className="attachment-info">
        <span className="mb-2">
            <FontAwesomeIcon icon={faPaperclip} className='me-2' />
            <span className="file-name">
                {file.name}
            </span>
        </span>
        <div>
            <span className="file-size">
                {formattedSize} MB
            </span>
        </div>
        <div className="text-end mt-1">
            <span className="remove-attachment" onClick={onRemove} style={{fontSize : 14}}>Remove</span>
        </div>
    </div>
  )
}
