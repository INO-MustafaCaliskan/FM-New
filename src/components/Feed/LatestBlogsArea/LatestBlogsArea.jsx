import client from '@/utils/client';
import React, { useEffect, useState } from 'react'
import BlogItem from './components/BlogItem';
import BlogLoadingSkeleton from './components/BlogLoadingSkeleton';
import GeneralTitle from '../Common/GeneralTitle';
import styles from './LatestBlogsArea.module.css';

const LatestBlogsArea = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/Blog/GetLastBlogsWithCount/10`);
        if (response && response.data.success) {
          setLatestBlogs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <GeneralTitle title="Latest Blogs" className="mb-3" />
        {loading ? (
          <BlogLoadingSkeleton />
        ) : latestBlogs.length > 0 ? (
          <div className={styles.list}>
            {latestBlogs.map((blog) => (
              <BlogItem key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No blog posts yet.</p>
        )}
      </div>
    </div>
  )
}

export default LatestBlogsArea