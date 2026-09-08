import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './emoji-select.module.css';

export const EmojiSelect = ({onEmojiClick, className, width = 350, height = 450, style, iconSize = 32, searchDisabled = true}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        imageRef.current !== event.target && // Image simgesine tıklandığında kapatma
        !imageRef.current.contains(event.target) // (Bazı durumlarda tıklanan öğe `Image`'ın iç öğesi olabilir)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef]);

  return (
    <div className={`d-flex align-items-center ${styles.general_container}`}>
      <label htmlFor="emoji-button">
        <Image 
          ref={imageRef}
          src="/images/emoji-icon.png" width={iconSize} height={iconSize} alt="emoji-button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={styles.picker_image}
          style={{opacity : showEmojiPicker ? 0.5 : 1 }}
        />
      </label>
      {
        showEmojiPicker &&
          <div ref={pickerRef} className={styles.picker_container}>
            <EmojiPicker 
              open={showEmojiPicker} 
              onEmojiClick={onEmojiClick} 
              theme='light'
              emojiStyle="native"
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
              className={className}
              width={width}
              height={height}
              style={style}
              previewConfig={{ showPreview: false }} 
              searchDisabled={searchDisabled}
              //getEmojiUrl
            />
          </div>
      }

    </div>
  )
}
