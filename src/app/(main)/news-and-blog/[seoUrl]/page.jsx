
import BlogDetailPage from '../BlogDetailPage'
import client from "@/utils/client";

export async function generateMetadata({ params }) {
  const { seoUrl } = params;

  const response = await client.get(`Blog/GetBySeoUrl/${seoUrl}`);
  const blog = response.data.data;
  const title =
    blog.metaTitle || blog.title;

  const description =
    blog.metaDescription ||
    blog.shortDescription ||
    blog.title;
  const imageUrl = blog.imageUrl
    ? blog.imageUrl
    : "https://freighttalk.com/images/freight-talk-logo.jpg";

  return {
    title,
    description,
    openGraph: {
      siteName: "FreightTalk",
      locale: "tr_TR",
      title: blog.title,
      description: blog.shortDescription || blog.title,
      type: "article",
      url: `https://freighttalk.com/news-and-blog/${seoUrl}/`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.shortDescription || blog.title,
      images: [imageUrl],
    },
  };
}



const page = () => {
  return (
    <BlogDetailPage />
  )
}

export default page