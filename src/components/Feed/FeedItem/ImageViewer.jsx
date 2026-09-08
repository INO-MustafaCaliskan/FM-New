import React from 'react'
import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import styles from './ImageViewer.module.css';

export const ImageViewer = ({medias, carouselStartIndex = 0}) => {
    const [index, setIndex] = React.useState(carouselStartIndex);

    const handleSlide = (direction) => {
        if (direction === 'next') {
            if(index < medias.length - 1){
                setIndex(index + 1);
            }
        } else {
            if(index > 0){
                setIndex(index - 1);
            }
        }
    }

  return (
    <div className={styles.iv}>
        <div className={styles.iv_view_port}>
            <div className={`${styles.iv_container} d-flex`}>
                <div className={styles.iv_slide}>
                    <div className={`${styles.iv_slide_inner} d-flex justify-content-center align-items-center`}>
                        <img src={medias[index].mediaUrl} alt={`Slide ${index + 1}`} className={`img-fluid ${styles.iv_slider_image}`} />
                    </div>
                </div>
            </div>
        </div>
        <div className={`${styles.iv_navigation} d-flex justify-content-between align-items-center`}>
            <button className={`${styles.iv_navigation_button} ms-4 ${index === 0 ? 'invisible' : ''}`} onClick={() => handleSlide('prev')}><RxChevronLeft size={28} /></button>
            <button className={`${styles.iv_navigation_button} me-4 ${index === medias.length - 1 ? 'invisible' : ''}`} onClick={() => handleSlide('next')}><RxChevronRight size={28} /></button>
        </div>
      
    </div>
  )
}
