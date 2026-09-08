import { create } from 'zustand'
import client from '@/utils/client';
import { toast } from 'react-toastify';

const useFeed = create((set) => ({
  feeds : [],
  feedPaginatedDetails : {
    page : 1,
    hasNextPage : true,
    loadedTimeStamps : [], // her sayfa isteğinde, o sayfanın sonundaki feed'in timestamp'ini bu diziye ekle. Böylece aynı timestamp'e sahip feed'ler için tekrar istek atılmaz.,
    hasError : false
  },
  loading : false,
  processing : false,
  processError : null,
  popUpFeed : null,
  editingFeed : null,
  likesLoading : false,
  showingLikes : null,
  info : null,
  singlePageFeed : {
    item : null,
    itemLoading : false,
    commentsLoading : false,
    loadingError : null
  },
  loadSinglePageFeed : async (id) => {
    set({singlePageFeed : {item : null, itemLoading : true, commentsLoading : true, loadingError : null}});
    const feed = await getFeedById(id);
    if(feed){
        set((state) => ({singlePageFeed : { ...state.singlePageFeed, item : {...feed, comments : []}, itemLoading: false }}));
        const comments = await getCommentsByFeedId(id);
        set((state) => ({
            singlePageFeed : {
                ...state.singlePageFeed,
                item : {
                    ...state.singlePageFeed.item,
                    comments : comments
                },
                commentsLoading : false
            }
        }));
    }
    else
        set((state) => ({singlePageFeed : { ...state.singlePageFeed, itemLoading: false, loadingError: "Failed to load feed." }}));
  },
  loadFeeds : async (onlyUserFeeds = false, userId = null) => {
    set({loading : true});
    const query = onlyUserFeeds 
                    ? `?onlyUserFeeds=true` 
                    : userId ? `?user=${userId}` : '';
    try {
        const response =  await client.get('/feed/GetFeeds' + query);
        if(response.data && response.data.success){
            set((state) => ({
                feeds : response.data.data.items, 
                loading : false,
                feedPaginatedDetails : {
                    ...state.feedPaginatedDetails,
                    page : 1,
                    hasNextPage : response.data.data.hasMore,
                    loadedTimeStamps : [],
                    hasError : false
                }
            }));
        }else{
            set((state) => ({
                loading : false,
                feedPaginatedDetails : {
                    ...state.feedPaginatedDetails,
                    hasError : true
                }
            }));
        }
    }catch(err) {
      console.error("Error loading feeds:", err);
      set((state) => ({
        loading : false,
        feedPaginatedDetails : {
            ...state.feedPaginatedDetails,
            hasError : true
        }
      }));
    }
  },
  loadNexPageFeeds : async (dateBefore) => {
    // dateBefore milisaniye cinsinden unix timestamp olarak gönderilmeli, feed nesnesinin içinde mevcut
    const currentState = useFeed.getState();
    if(currentState.feedPaginatedDetails.loadedTimeStamps.includes(dateBefore)) {
        return;
    }

    if(!currentState.feedPaginatedDetails.hasNextPage || currentState.feedPaginatedDetails.hasError || currentState.loading) {
        return;
    }

    set({loading : true});
    try {
        const response =  await client.get('/feed/GetFeeds?dateBefore=' + dateBefore);
        if(response.data && response.data.success){
            set((state) => ({
                feeds : [...state.feeds, ...response.data.data.items], 
                loading : false,
                feedPaginatedDetails : {
                    ...state.feedPaginatedDetails,
                    page : state.feedPaginatedDetails.page + 1,
                    hasNextPage : response.data.data.hasMore,
                    loadedTimeStamps : [...state.feedPaginatedDetails.loadedTimeStamps, dateBefore]
                }
            }));
        }else{
            set({
                loading : false,
                feedPaginatedDetails : {
                    ...currentState.feedPaginatedDetails,
                    hasError : true
                }
            });
        }
    }catch(err) {
      console.error("Error loading feeds:", err);
      set({
        loading : false,
        feedPaginatedDetails : {
            ...currentState.feedPaginatedDetails,
            hasError : true
        }
      });
    }
  },
  createNewFeed : async (content, medias) => {
    set({processing : true});
    try{
        const response = await client.post('/feed/Create', {
            content,
            medias
        });
        if(response.data && response.data.success){
            const newFeed = response.data.data;
            set((state) => ({
                feeds : [newFeed, ...state.feeds],
                processing : false
            }));
            return true;
        }else {
            set({
                processing : false, 
                processError : response.data.message
            });
            return false;
        }
    }catch(err){
        console.error("Error creating new feed:", err);
        set({processing : false, processError : "An error occurred while creating the feed."});
         return false;
    }
  },
  editFeed : async (id, content, medias) => {
    set({processing : true});
    try{
        const response = await client.post('/feed/Edit', {
            id,
            content,
            medias
        });
        if(response.data && response.data.success){
            const updatedFeed = response.data.data;
            set((state) => ({
                feeds : state.feeds.map(feed => feed.id === id ? {...feed, ...updatedFeed } : feed),
                popUpFeed : state.popUpFeed && state.popUpFeed.id === id ? {...state.popUpFeed, ...updatedFeed} : state.popUpFeed,
                singlePageFeed : state.singlePageFeed.item && state.singlePageFeed.item.id === id ? {...state.singlePageFeed, item : {...state.singlePageFeed.item, ...updatedFeed}} : state.singlePageFeed,
                processing : false
            }));
            return true;
        }else {
            set({
                processing : false, 
                processError : response.data.message
            });
            return false;
        }
    }catch(err){
        console.error("Error editing feed:", err);
        set({processing : false, processError : "An error occurred while editing the feed."});
        return false;
    }
  },
  deleteFeed : async (id) => {
    set({processing : true});
    try{
        const response = await client.get(`/feed/Delete/${id}`);
        if(response.data && response.data.success){
            set((state) => ({
                feeds : state.feeds.filter(feed => feed.id !== id),
                popUpFeed : state.popUpFeed && state.popUpFeed.id === id ? null : state.popUpFeed,
                singlePageFeed : state.singlePageFeed.item && state.singlePageFeed.item.id === id ? {...state.singlePageFeed, item : null} : state.singlePageFeed,
                processing : false
            }));
            toast.success("Feed deleted successfully.");
            return true;
        }else {
            set({
                processing : false, 
                processError : response.data.message
            });
            toast.error("Failed to delete feed: " + response.data.message);
            return false;
        }
    }catch(err){
        console.error("Error deleting feed:", err);
        set({processing : false, processError : "An error occurred while deleting the feed."});
        return false;
    }
  },
  showOnPopUp : async (id, customFeed = null, getCommentsAuto = false, carouselStartIndex = 0) => {
    set({processing : true});
    let feed;
    if(customFeed)
        feed = customFeed;
    else
        feed = await getFeedById(id);

    if(feed){
        let comments = [];
        if(getCommentsAuto)
            comments = await getCommentsByFeedId(id)
        
        set({popUpFeed : {...feed, comments : comments, carouselStartIndex : carouselStartIndex}, processing : false});
    }else{
        set({processing : false, processError : "Failed to load feed details."});
    }
  },
  closePopUp : () => set({popUpFeed : null}),
  setEditingFeed : async (id, defaultFeed) => {
    set({processing : true})
    let feed;
    if(defaultFeed)
        feed = defaultFeed;
    else
        feed = await getFeedById(id);

    if(feed)
        set({editingFeed : feed, processing : false});
    else
        set({processing : false, processError : "Failed to load feed for editing."});
    
  },
  closeEditingFeed : () => set({editingFeed : null}),
  getById : async (id) => await getFeedById(id),
  like : async (id) => {
    set((state) => ({
        feeds : state.feeds.map(feed => {
            if(feed.id === id){
                return {
                    ...feed,
                    isUserLiked : true,
                    likeCount : feed.likeCount + 1
                }
            }else{
                return feed;
            }
        }),
        popUpFeed : state.popUpFeed && state.popUpFeed.id === id ? {
            ...state.popUpFeed,
            isUserLiked : true,
            likeCount : state.popUpFeed.likeCount + 1
        } : state.popUpFeed,
        singlePageFeed : state.singlePageFeed.item && state.singlePageFeed.item.id === id ? {
            ...state.singlePageFeed,
            item : {
                ...state.singlePageFeed.item,
                isUserLiked : true,
                likeCount : state.singlePageFeed.item.likeCount + 1
            }
        } : state.singlePageFeed
    }))

    try{
        const response = await client.get(`/FeedLike/Like/${id}`);
        if(response.data && response.data.success){
            return true;
        }else{
            set({processError : response.data.message});
            return false;
        }
    }catch(err){
        console.error("Error liking feed:", err);
        set({processError : "An error occurred while liking the feed."});
        return false;
    }
  },
  unlike : async (id) => {
    set((state) => ({
        feeds : state.feeds.map(feed => {
            if(feed.id === id){
                return {
                    ...feed,
                    isUserLiked : false,
                    likeCount : feed.likeCount - 1
                }
            }else{
                return feed;
            }
        }),
        popUpFeed : state.popUpFeed && state.popUpFeed.id === id ? {
            ...state.popUpFeed,
            isUserLiked : false,
            likeCount : state.popUpFeed.likeCount - 1
        } : state.popUpFeed,
        singlePageFeed : state.singlePageFeed.item && state.singlePageFeed.item.id === id ? {
            ...state.singlePageFeed,
            item : {
                ...state.singlePageFeed.item,
                isUserLiked : false,
                likeCount : state.singlePageFeed.item.likeCount - 1
            }
        } : state.singlePageFeed
    }))
    try{
        const response = await client.get(`/FeedLike/Unlike/${id}`);
        if(response.data && response.data.success){
            return true;
        }else{
            set({processError : response.data.message});
            return false;
        }
    }catch(err){
        console.error("Error unliking feed:", err);
        set({processError : "An error occurred while unliking the feed."});
        return false;
    }
  },
  toggleLike : async (id, isCurrentlyLiked) => {
    if(isCurrentlyLiked){
        return await useFeed.getState().unlike(id);
    }else{
        return await useFeed.getState().like(id);
    }
},
  showLikes : async (id) => {
    set({likesLoading : true, showingLikes : null});
    try{
        const response = await client.get(`/FeedLike/GetAllLikes/${id}`);
        if(response.data && response.data.success){
            set({showingLikes : response.data.data, likesLoading : false});
            return response.data.data;
        }
    }catch(err){
        console.error("Error fetching feed likes:", err);
        set({likesLoading : false});
        return [];
    }
  },
  closeLikes : () => set({showingLikes : null}),
  getComments : async (feedId) => {
    return await getCommentsByFeedId(feedId);
  },
  addComment : async (feedId, comment, replyingUserId) => {
    try{
        const response = await client.post('/feedComment/Add', {
            feedId,
            comment,
            replyingUserId
        });
        if(response.data && response.data.success){
            const newComment = await getCommentById(response.data.data.id);
            
            set((state) => ({
                popUpFeed : state.popUpFeed ?{   
                    ...state.popUpFeed,
                    commentCount : state.popUpFeed.commentCount + 1,
                } : null,
                feeds : state.feeds.map(feed => {
                        if(feed.id === feedId){
                            return {
                                ...feed,
                                commentCount : feed.commentCount + 1
                            }
                        }else{
                            return feed;
                        }
                    })
            }));

            return newComment;
        }else {
            set({
                processError : response.data.message
            });

            return null;
        }
    }catch (err){
        set({processError : "An error occurred while adding the comment."});
        return null;
    }
  },
  editComment : async (id, comment, replyingUserId) => {
    try{
        const response = await client.post('/feedComment/Edit', {
            id,
            comment,
            replyingUserId
        });
        if(response.data && response.data.success){
            const updatedComment = await getCommentById(id);
            return updatedComment;
        }else {
            set({
                processError : response.data.message
            });
            return null;
        }
    }catch(err){
        console.error("Error editing comment:", err);
        set({processError : "An error occurred while editing the comment."});
        return null;
    }
  },
  deleteComment : async (id) => {
    try{
        const response = await client.get(`/feedComment/Delete/${id}`);
        if(response.data && response.data.success){
            set((state) => ({
                popUpFeed : state.popUpFeed ? {
                    ...state.popUpFeed, 
                    commentCount : state.popUpFeed.commentCount - 1,
                } : null,
                feeds : state.feeds.map(feed => {
                    if(feed.id === state.popUpFeed.id){
                        return {
                            ...feed,
                            commentCount : feed.commentCount - 1
                        }
                    }else{
                        return feed;
                    }
                })
            }));
        }else {
            set({
                processError : response.data.message
            });
        }

        return response.data;
    }catch(err){
        console.error("Error deleting comment:", err);
        set({ processError : "An error occurred while deleting the comment."});
        return {success : false, message : "An error occurred while deleting the comment."};
    }
  },
  reportFeed : async (id, reason) => {
    set({processing : true});
    try{
        const response = await client.get('/FeedReport/Report?id=' + id + '&reason=' + reason);
        if(response.data && response.data.success){
            set({processing : false, info : "Thank you for reporting. We will review the feed shortly."});
            toast.success("Feed reported successfully.");
            return true;
        }else {
            set({
                processing : false,
                processError : response.data.message
            });
            toast.error("Failed to report feed: " + response.data.message);
            return false;
        }
    }catch(err){
        console.error("Error reporting feed:", err);
        set({processing : false, processError : "An error occurred while reporting the feed."});
        toast.error("An error occurred while reporting the feed.");
        return false;
    }
  },
  closeInfo : () => set({info : null})
}))

export default useFeed

const getFeedById = async (id) => {
    try{
        const response = await client.get(`/feed/GetById/${id}`);
        if(response.data && response.data.success){
            return response.data.data;
        }else {
            return null;
        }
    }catch(err){
        console.error("Error fetching feed by ID:", err);
        return null;
    }
  }

const getCommentById = async (id) => {
    try{
        const response = await client.get(`/FeedComment/GetById/${id}`);
        if(response.data && response.data.success){
            return response.data.data;
        }else {
            return null;
        }
    }catch(err){
        console.error("Error fetching comment by ID:", err);
        return null;
    }
}

const getCommentsByFeedId = async (feedId) => {
    try{
        const response = await client.get(`/feedComment/GetAllComments/${feedId}`);
        if(response.data && response.data.success){
            return response.data.data;
        }else {
            return [];
        }
    }catch(err){
        console.error("Error fetching comments:", err);
        return [];
    }
}