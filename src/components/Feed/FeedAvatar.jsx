import Image from 'next/image'
import React from 'react'

const FeedAvatar = ({ imageUrl, altName, className, width = 50, height = 50, priority = false }) => {
  return (
    <Image 
        src={imageUrl || "/images/empty-image.png"} 
        alt={altName}
        className={`rounded-circle border ${className || ''}`} 
        width={width}
        height={height}
        style={{ objectFit: 'cover' }}
        priority={priority} />
  )
}

export default FeedAvatar