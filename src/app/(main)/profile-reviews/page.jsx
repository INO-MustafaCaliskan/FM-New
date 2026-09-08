'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import InoLoading from '@/components/InoLoading/InoLoading'

const ProfileReviews = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading } = useUser()
    const reviewId = searchParams.get('reviewId')

    useEffect(() => {
        if (loading) return
        if (!user?.id) return

        const url = reviewId
            ? `/user-profile/${user.slug}?reviewId=${reviewId}`
            : `/user-profile/${user.slug}?tab=reviews`
        router.replace(url)
    }, [user, loading, reviewId, router])

    return <InoLoading />
}

export default ProfileReviews;
