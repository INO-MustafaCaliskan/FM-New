"use client"
import useFeed from '@/context/FeedContext'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import '../feed.css'
import DetailedFeedItem from '@/components/Feed/FeedItem/DetailedFeedItem'
import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb'

const FeedDetailPage = () => {
  const isMobile = window.innerWidth < 992;

  const { singlePageFeed, loadSinglePageFeed } = useFeed();
  const { id } = useParams();

  useEffect(() => {
    const fetchFeedDetail = async () => {
      if (id) {
        await loadSinglePageFeed(id);
      }
    }
    fetchFeedDetail();
  }, [id, loadSinglePageFeed])

  return (
    <div className={`container ${isMobile ? 'w-100' : 'w-50'}`} id='feed-area'>
      <InoBreadcrumb linkName="Feed Detail" subRoots={[{ href: "/feed", name: "Feed" }]} id="feed-breadcrumb" />
      <div className='row'>
        <div className="col-12">
          {
            singlePageFeed.itemLoading
              ? <p className='text-center mt-4'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</p>
              : singlePageFeed.item && (
                <DetailedFeedItem feed={singlePageFeed.item} />
              )
          }
        </div>
      </div>
    </div>
  )
}

export default FeedDetailPage;