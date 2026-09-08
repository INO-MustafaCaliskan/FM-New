import FaqClient from "./FaqClient"


export const metadata = {
  title: "Business Networking Platform FAQ & Help",
  description: "Find answers to common questions about using Freight Talk, from features to pricing, and learn how to maximize your business networking experience.",
  openGraph: {
    siteName: "FreightTalk",
    locale: "tr_TR",
    title: "Business Networking Platform FAQ & Help",
    description: "Find answers to common questions about using Freight Talk, from features to pricing, and learn how to maximize your business networking experience.",
    type: "website",
    url: "https://freighttalk.com/solution-partners/",
    images: [
      {
        url: "https://freighttalk.com/images/freight-talk-icon.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
const page = () => {
  return (
    <FaqClient />
  )
}

export default page