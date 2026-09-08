import { notFound } from "next/navigation";
import client from "@/utils/client";
import SolutionPartnerClient from "./SolutionPartnerClient";
export const dynamic = "force-dynamic";

async function getSolutionPartner(seoUrl) {
  try {
    const res = await client.get(
      `/SolutionPartner/GetBySeoUrl/seoUrl?seoUrl=${seoUrl}`
    );
   
    return res?.data?.data ?? null;
 
  } catch (error) {
    console.error("Solution Partner fetch error:", error);
    return null;
  }
}

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const partner = await getSolutionPartner(params.seoUrl);

  if (!partner) {
    return {
      title: "Solution Partner Not Found",
      description: "The requested solution partner could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const imageUrl = partner.imageUrl
    ? partner.imageUrl.startsWith("http")
      ? partner.imageUrl
      : `https://${partner.imageUrl}`
    : "https://freighttalk.com/images/no-img.png";

  const url = `https://freighttalk.com/solution-partner-detail/${params.seoUrl}`;

  return {
    title: partner.name,
    description: partner.shortDescription || partner.title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: partner.name,
      description: partner.shortDescription || partner.title,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: partner.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: partner.name,
      description: partner.shortDescription || partner.title,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }) {
  const partner = await getSolutionPartner(params.seoUrl);

  if (!partner) {
    notFound();
  }

  const imageUrl = partner.imageUrl
    ? partner.imageUrl.startsWith("http")
      ? partner.imageUrl
      : `https://${partner.imageUrl}`
    : "https://freighttalk.com/images/no-img.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: partner.name,
    url: `https://freighttalk.com/solution-partner-detail/${params.seoUrl}`,
    logo: imageUrl,
    description: partner.shortDescription,
    sameAs: partner.website ? [partner.website] : [],
  };

  return (
    <>
      <script
        id="solution-partner-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <SolutionPartnerClient  />
    </>
  );
}
