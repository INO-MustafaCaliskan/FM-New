import Image from 'next/image'
import React from 'react'

const UserAvatar = ({ imageUrl, altName, style = {}, width = 50, height = 50, priority = false }) => {
  return (
    <div style={{borderRadius: '50%', overflow: 'hidden', ...style}}>
      <Image 
          src={imageUrl || "/images/empty-image.png"} 
          alt={altName}
          className="rounded-circle" 
          width={width}
          height={height}
          style={{objectFit : 'cover'}}
          priority={priority}
          />
    </div>
  )
}

export default UserAvatar