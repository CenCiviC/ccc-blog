import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  NoSuchKey,
} from "@aws-sdk/client-s3";
import { cache } from "react";
import { Readable } from "stream";

import { encodeBase64Url } from "@/lib/encoding-utils";
import { requireEnv } from "@/lib/env";
import { streamToString } from "@/lib/stream-utils";
import { MDData } from "@/lib/types";

const s3Client = new S3Client({
  region: "ap-northeast-2", // 버킷의 aws 리전
  credentials: {
    accessKeyId: requireEnv("CCC_AWS_ACCESS_KEY"),
    secretAccessKey: requireEnv("CCC_AWS_SECRET_KEY"),
  },
});

const BUCKET_NAME = "ccc-blog";
// 발행 대상 폴더 - 이 밖의 S3 객체는 사이트에 노출되지 않는다
const FOLDER_PREFIXES = ["programming/", "side project/", "kyungbin/"];

export type MarkdownFile = {
  key: string; // ex. programming/aws/file.md
  lastModified: Date | undefined;
};

// 발행 대상 폴더의 .md 목록을 가져온다.
// - cache(): 한 번의 렌더 패스(layout + page + metadata)에서 S3를 한 번만 조회
// - 실패 시 throw: 자격증명 문제 등을 "글 0개"로 조용히 삼키지 않고 빌드를 깨뜨린다
export const listMarkdownFiles = cache(async (): Promise<MarkdownFile[]> => {
  const files: MarkdownFile[] = [];

  for (const prefix of FOLDER_PREFIXES) {
    let continuationToken: string | undefined;

    // ListObjectsV2는 최대 1,000개씩 반환하므로 페이지네이션 처리
    do {
      const response = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      );

      for (const object of response.Contents ?? []) {
        if (object.Key?.endsWith(".md")) {
          files.push({ key: object.Key, lastModified: object.LastModified });
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  }

  return files;
});

// 특정 파일 내용을 가져온다. 파일이 없으면 null (호출부에서 notFound 처리),
// 그 외 오류는 throw.
export const getMarkdownContent = cache(
  async (path: string): Promise<MDData | null> => {
    try {
      const response = await s3Client.send(
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path })
      );

      const content = await streamToString(response.Body as Readable);
      const title = path.split("/").pop()!.replace(/\.md$/, "");

      return {
        id: encodeBase64Url(title),
        path,
        title,
        content,
        lastModifiedDate: response.LastModified,
      };
    } catch (error) {
      if (error instanceof NoSuchKey) return null;
      throw error;
    }
  }
);

// 모든 마크다운 파일 데이터 가져오기 (검색 인덱스, llms.txt용)
export async function getAllMarkdownDatas(): Promise<MDData[]> {
  const files = await listMarkdownFiles();
  const datas = await Promise.all(
    files.map(file => getMarkdownContent(file.key))
  );
  return datas.filter((data): data is MDData => data !== null);
}
