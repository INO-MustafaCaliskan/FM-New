import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import styles from './ImageCarousel.module.css';

export const ImageCarousel = ({medias, carouselStartIndex = 0}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex: carouselStartIndex });
    const [index, setIndex] = React.useState(carouselStartIndex);

    const handleSlide = (direction) => {
        if (!emblaApi) return
        if (direction === 'next') {
            if(emblaApi.canScrollNext()){
                emblaApi.scrollNext()
                setIndex(emblaApi.selectedScrollSnap());
            }

        } else {
            if(emblaApi.canScrollPrev()){
                emblaApi.scrollPrev()
                setIndex(emblaApi.selectedScrollSnap());
            }
        }
    }

  return (
    <div className={styles.embla}>
        <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
                {medias.map((media, index) => (
                    <div className={styles.embla__slide} key={index}>
                        <div className="embla__slide__inner d-flex justify-content-center align-items-center" style={{height: '400px', backgroundColor: 'black'}}>
                            <img src={media.mediaUrl} alt={`Slide ${index + 1}`} className='img-fluid' style={{maxHeight : 400, width : 'auto', objectFit : 'cover'}} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className={`${styles.embla__navigation} d-flex justify-content-between align-items-center`}>
            <button className={`${styles.embla__prev} ms-4 ${index === 0 ? 'invisible' : ''}`} onClick={() => handleSlide('prev')}><RxChevronLeft size={28} /></button>
            <button className={`${styles.embla__next} me-4 ${index === medias.length - 1 ? 'invisible' : ''}`} onClick={() => handleSlide('next')}><RxChevronRight size={28} /></button>
        </div>
      
    </div>
  )
}