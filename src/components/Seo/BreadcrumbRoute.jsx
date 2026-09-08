"use client";
import { usePathname } from "next/navigation";

export default function BreadcrumbRoute() {
  const pathname = usePathname();

  const baseUrl = "https://freighttalk.com";

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map(seg =>
      seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
    );

  let urlAccumulator = baseUrl;

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  segments.forEach((seg, i) => {
    urlAccumulator += "/" + pathname.split("/").filter(Boolean)[i];

    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: seg,
      item: urlAccumulator,
    });
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
