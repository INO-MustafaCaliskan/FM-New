import useFormatDate from '@/utils/hooks/useFormatDate'
import Link from 'next/link'
import styles from './BlogItem.module.css'
import { LuCalendar } from 'react-icons/lu'

const BlogItem = ({ blog }) => {
  const formatDate = useFormatDate()
  return (
    <Link href={`/news-and-blog/${blog.seoUrl}`} title={blog.title} className={styles.item}>
      <span className={styles.dot} />
      <div className={styles.content}>
        <h6 className={styles.title}>{blog.title}</h6>
        <small className={styles.date}>
          <LuCalendar />
          {formatDate(blog.publishDate)}
        </small>
      </div>
    </Link>
  )
}

export default BlogItem