import SolutionPartnerClient from "./SolutionPartnersClient"

export const metadata = {
  title: "Our Global Business Networking Partners",
  description: "Explore our global network of solution partners and discover trusted companies that enhance your business connections and growth opportunities.",
   url: "https://freighttalk.com/faq/",
    images: [
      {
        url: "https://freighttalk.com/images/freight-talk-icon.png",
        width: 1200,
        height: 630,
      },
    ],
};
const page = () => {
  return (
    <SolutionPartnerClient />
  )
}

export default page