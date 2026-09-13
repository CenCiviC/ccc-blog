import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";
import { encodePathSegments } from "@/lib/encoding-utils";
import { getAllMarkdownDatas } from "@/services/aws-s3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 본문까지 읽는 이유 - 프론트매터에 적은 수정일을 쓰기 위해서.
  // (ListObjectsV2는 S3 업로드 시각만 주므로 페이지 표시 날짜와 어긋난다)
  const datas = await getAllMarkdownDatas();

  const postUrls = datas.map(data => ({
    url: `${SITE_URL}/dot/${encodePathSegments(data.path)}`,
    lastModified: data.lastModifiedDate, // 프론트매터 날짜, 없으면 S3 수정 시각
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
