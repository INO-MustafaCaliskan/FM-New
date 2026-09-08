const baseUrl = "https://freighttalk.com";
const apiBaseUrl = "https://api.freighttalk.com";

async function fetchJSON(url) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 100 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Sitemap fetch error:", url, error);
    return null;
  }
}

function escapeXML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${escapeXML(url.url)}</loc>
        <lastmod>${url.lastModified.toISOString()}</lastmod>
      </url>`,
      )
      .join("")}
  </urlset>`;
}

export async function GET() {
  const [blogRes, solutionPartnerRes] = await Promise.all([
    fetchJSON(
      `${apiBaseUrl}/api/Blog/GetPublicBlogsPaging?pageNumber=1&pageSize=2000`,
    ),
    fetchJSON(
      `${apiBaseUrl}/api/SolutionPartner/GetPaginatedList?pageNumber=1&pageSize=2000`,
    ),
  ]);

  const blogs = blogRes?.data?.listItems || [];
  const solutionPartners = solutionPartnerRes?.data?.listItems || [];

  const safeDate = (date) => (date ? new Date(date) : new Date());

  const blogUrls = blogs.map((item) => ({
    url: `${baseUrl}/news-and-blog/${item.seoUrl}/`,
    lastModified: safeDate(item.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const solutionPartnerUrls = solutionPartners.map((item) => ({
    url: `${baseUrl}/solution-partners-detail/${item.seoUrl}/`,
    lastModified: safeDate(item.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages = [
    "/about-us/",
    "/news-and-blog/",
    "/pricing/",
    "/verification/",
    "/faq/",
    "/contact-us/",
    "/privacy-policy/",
    "/terms-and-conditions/",
    "/cookie-policy/",
    "/warranty-policy/",
    "/solution-partners/",
  ];

  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...blogUrls,
    ...solutionPartnerUrls,
  ];

  const xml = generateXML(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
