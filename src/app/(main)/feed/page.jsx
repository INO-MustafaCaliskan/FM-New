"use client"
import './feed.css'
import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb';
import LatestBlogsArea from '@/components/Feed/LatestBlogsArea/LatestBlogsArea';
import FeedLeftPanel from '@/components/Feed/FeedLeftPanel/FeedLeftPanel';
import FeedsArea from '@/components/Feed/FeedsArea/FeedsArea';


const FeedPage = () => {
    const isMobile = window.innerWidth < 992;
  return (
    <div className="container" id='feed-area'>
        <InoBreadcrumb linkName="News Feed" id="feed-breadcrumb" />
        <div className="row">
            {
                !isMobile && (
                    <div className="col-3">
                        <FeedLeftPanel />
                    </div>
                )
            }
        
            <div className={isMobile ? "col-12 px-0" : "col-6"}>
                <FeedsArea />
            </div>

            {
                !isMobile && (
                    <div className="col-3">
                        <LatestBlogsArea />
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default FeedPage