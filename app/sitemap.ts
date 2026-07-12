import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";
import { encodePathSegments } from "@/lib/encoding-utils";
import { listMarkdownFiles } from "@/services/aws-s3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = await listMarkdownFiles();

  const postUrls = files.map(file => ({
    url: `${SITE_URL}/dot/${encodePathSegments(file.key)}`,
    lastModified: file.lastModified, // S3의 실제 수정 시각
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "yearly",
      priority: 1,
    },
    ...postUrls,
  ];
}
