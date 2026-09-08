import Script from "next/script";

export default function HomeStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Freight Talk",
    "url": "https://freighttalk.com/",
    "logo": "https://freighttalk/images/freight-talk-logo.png",
    "description": "Leaders and teams from logistics, technology, finance, manufacturing, retail, agriculture, services, and dozens of other sectors actively connect, communicate, and develop new business every day on the Freight Talk Virtual Business Networking Platform.",
    "foundingDate": "2025",
    "sameAs": [
      "https://www.linkedin.com/showcase/freighttalk",
      "https://www.facebook.com/thefreighttalk",
      "https://www.instagram.com/thefreighttalk/",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90 533 074 11 81",
      "email": "hello@freighttalk.com",
      "contactType": "customer service",
    }
  };

  return (
    <Script
      id="home-organization-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}