import styles from './FeedItemContent.module.css';

export const FeedItemContent = ({content}) => {
  return (
    <div className={`${styles.feed_content} mt-3 mb-2`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
