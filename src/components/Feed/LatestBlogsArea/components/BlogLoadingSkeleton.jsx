import { Skeleton } from '@mui/material'
import { memo } from 'react'

const BlogLoadingSkeleton = () => {
    return (
        <>
            {
                Array(5).fill().map((_, index) => (
                    <div key={index} className='mb-3'>
                        <Skeleton  variant="text" sx={{ fontSize: '1.2rem' }}/>
                        <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={80} />
                    </div>
                ))
            }
        </>
    )
}

export default memo(BlogLoadingSkeleton)