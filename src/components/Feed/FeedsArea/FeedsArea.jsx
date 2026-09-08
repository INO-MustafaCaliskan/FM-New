import { useEffect, useState } from "react";
import FeedItem from "../FeedItem/FeedItem";
import PopUpFeedModal from "@/components/Feed/Modals/PopUpFeedModal";
import { FeedCrudModal } from "@/components/Feed/Modals/FeedCrudModal";
import { LikedUsersModal } from "@/components/Feed/Modals/LikedUsersModal";
import { NewFeedArea } from "./components/NewFeedArea";
import useFeed from "@/context/FeedContext";

const FeedsArea = ({onlyUserFeeds = false, userId = null, showNewFeedArea = true}) => {
    const {feeds, loadFeeds, popUpFeed, loadNexPageFeeds, feedPaginatedDetails, loading, editingFeed, closeEditingFeed} = useFeed(state => state);
    const [showNewFeedModal, setShowNewFeedModal] = useState(false);

    const showModal = showNewFeedModal || editingFeed;

        // Infinite scroll için scroll event listener
    useEffect(() => {
        const handleScroll = async () => {
            // Eğer loading ise veya daha fazla sayfa yoksa, işlem yapma
            if (loading || !feedPaginatedDetails.hasNextPage) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Sayfanın sonuna yaklaşıldığında (100px kala)
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                if (feeds.length > 0) {
                    const lastFeed = feeds[feeds.length - 1];
                    const dateBefore = lastFeed.createdAt;
                    if (dateBefore) {
                        await loadNexPageFeeds(dateBefore);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [feeds, loading, feedPaginatedDetails.hasNextPage, loadNexPageFeeds])
    
    useEffect(() => {
        const fetchFeeds = async () => {
            await loadFeeds(onlyUserFeeds, userId);
        }
        fetchFeeds();
    }, [loadFeeds, onlyUserFeeds, userId])

    return (
        <div>
            <div className="mb-4">
                {!loading && showNewFeedArea && <NewFeedArea onClickArea={() => setShowNewFeedModal(true)} />}
            </div>
            <div>
                {feeds.length > 0 
                    && feeds.map(feed => <FeedItem key={feed.id} feed={feed} />)
                }

                <div className='text-center'>
                    {
                        loading
                        ? <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        : feeds.length == 0 && <p className='text-center text-muted'>No feeds to show.</p>
                    }
                    {
                        !loading && !feedPaginatedDetails.hasNextPage && feeds.length > 0 && <p className='text-center text-muted'>No more feeds to load.</p>
                    }
                </div>
            </div>

            {
                popUpFeed && <PopUpFeedModal popUpFeed={popUpFeed} />
            }

            {
                showModal &&
                    <FeedCrudModal 
                        isShow={showModal}
                        onHide={() => {
                            editingFeed && closeEditingFeed();
                            setShowNewFeedModal(false)
                        }} 
                        mode={editingFeed ? "edit" : "create"} 
                        updatingFeed={editingFeed} 
                    />
            }
            <LikedUsersModal />
        </div>
    )
}

export default FeedsArea