import React from 'react'

const FeedMediaShowcase = ({ medias, showPopup }) => {
  return (
        <div className='feed-medias'>
            {
                medias?.length === 1
                && (
                    <div className='media-item w-100 d-flex justify-content-center align-items-center' onClick={() => showPopup(0)}>
                        <img src={medias[0].mediaUrl} alt={medias[0].mediaUrl.split('/').pop()} style={{height : medias[0].height}} />
                    </div>
                )
            }
            {
                medias?.length === 2
                && (
                    <div className='row p-0 m-0 g-2'>
                        <div className='media-item col-6 d-flex justify-content-center align-items-center ps-0 border-end' onClick={() => showPopup(0)}>
                            <img src={medias[0].mediaUrl} alt={medias[0].mediaUrl.split('/').pop()} style={{height : medias[0].height}} />
                        </div>
                        <div className='media-item col-6 d-flex justify-content-center align-items-center pe-0 border-start' onClick={() => showPopup(1)}>
                            <img src={medias[1].mediaUrl} alt={medias[1].mediaUrl.split('/').pop()} style={{height : medias[1].height}} />
                        </div>
                    </div>
                )
            }
            {
                medias?.length > 2
                && (
                    <div className='row p-0 m-0 g-2 multiple-medias'>
                        <div className="col-8 left-panel p-0 m-0">
                            <div className='media-item d-flex justify-content-center align-items-center ps-0 border-end' onClick={() => showPopup(0)}>
                                <img src={medias[0].mediaUrl} alt={medias[0].mediaUrl.split('/').pop()} style={{height : medias[0].height}} />
                            </div>
                        </div>
                        <div className="col-4 right-panel p-0 m-0">
                            <div className='w-100 media-item d-flex justify-content-center align-items-center' onClick={() => showPopup(1)}>
                                <img src={medias[1].mediaUrl} alt={medias[1].mediaUrl.split('/').pop()} style={{height : medias[1].height}} />
                            </div>
                            <div className='w-100 media-item d-flex justify-content-center align-items-center' onClick={() => showPopup(2)}>
                                <img src={medias[2].mediaUrl} alt={medias[2].mediaUrl.split('/').pop()} style={{height : medias[2].height}} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
  )
}

export default FeedMediaShowcase