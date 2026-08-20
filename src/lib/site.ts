export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Your Brand",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "A modern digital platform built for better experiences.",
  locale: "id_ID",
  language: "id",
  keywords: [ "Your Brand", "digital platform", "technology", "software" ],
  creator: "Your Brand",
  ogImage: "/og/default.png",
  twitterHandle: "@yourbrand",
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.png`,
  description: siteConfig.description,
  sameAs: [
    "https://www.instagram.com/yourstartup",
    "https://www.linkedin.com/company/yourstartup",
  ],
};