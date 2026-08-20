import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json() as Promise<
    {
      slug: string;
      updatedAt: string;
    }[]
  >;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}