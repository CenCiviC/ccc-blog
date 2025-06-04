import type { MetadataRoute } from "next";
import { getMarkdownTitles } from "@/services/aws-s3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 비동기로 데이터 가져오기
  const titles = await getMarkdownTitles();

  // 가져온 데이터 기반으로 사이트맵 생성
  const postUrls = titles.map((title) => ({
    url: `https://kyungbin.im/dot/${title}`,
    lastModified: new Date(), // 각 포스트의 수정 날짜
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // 기본 URL + 포스트 URL 반환
  return [
    {
      url: "https://kyungbin.im",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...postUrls, // 포스트 URL 추가
  ];
}
