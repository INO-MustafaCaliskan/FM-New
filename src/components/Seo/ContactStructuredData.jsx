import Script from "next/script";

export default function ContactStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Freight Talk - Contact Us",
    "url": "https://freighttalk.com/contact-us/",
    "mainEntity": {
      "@type": "Organization",
      "name": "Freight Talk",
      "url": "https://freighttalk.com/",    
      "logo": "https://freighttalk/images/FM_Logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Cinarli Mah. Ankara Asfalti Cd. Mistral Izmir No: 15 Ic Kapi No: 391",
        "addressLocality": "Konak",
        "addressRegion": "Izmir",
        "postalCode": "35250",
        "addressCountry": "TR"
      },
      "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90 533 074 11 81",
      "email": "hello@freighttalk.com",
      "contactType": "customer service",
      },
      "sameAs": [
      "https://www.linkedin.com/showcase/freighttalk",
      "https://www.facebook.com/thefreighttalk",
      "https://www.instagram.com/thefreighttalk/",
      ]
    }
  };

  return (
    <Script
      id="contact-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
