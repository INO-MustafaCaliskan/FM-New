import InoSlider from '@/components/InoSlider/InoSlider'
import React from 'react'
import PropTypes from 'prop-types';




const TalkClients = ({data}) => {
    const List = data.List
    return (
      <div className='mt-5 mb-5'>
        <div className='container'>
        <h2 className="title-primary mb-5 mt-5">{data.Title}</h2>
        </div>
        <InoSlider list={List} />
      </div>
    )
  }
  
  export default TalkClients