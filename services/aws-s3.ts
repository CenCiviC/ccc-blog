import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { MDData } from "@/lib/types";
import { streamToString } from "@/lib/stream-utils";
import { encodeToUUIDv4 } from "@/lib/encoding-utils";

// ListObjectsV2Command api 예시
// {
//   Key: 'programming/web/sticky 오류 시.md',
//   LastModified: 2024-12-19T08:57:17.000Z,
//   ETag: '"4c4b0af69e9aa130d17c985f81d504bc"',
//   ChecksumAlgorithm: [Array],
//   Size: 91,
//   StorageClass: 'STANDARD'
// },

const s3Client = new S3Client({
  region: "ap-northeast-2", // 버킷의 aws 리전
  credentials: {
    accessKeyId: process.env.CCC_AWS_ACCESS_KEY ?? "", // 사용자 생성 시 발급받은 액세스 키
    secretAccessKey: process.env.CCC_AWS_SECRET_KEY ?? "", // 사용자 생성 시 발급받은 비밀 액세스 키
  },
});

const DEFAULT_BUCKET_NAME = "ccc-blog";
const DEFAULT_FOLDER_PATHS = ["programming/", "side project/", "kyungbin/"];

// S3에서 폴더 내 파일 이름 가져오기 - 폴더 경로가 이름
export async function getMarkdownTitles(
  bucketName: string = DEFAULT_BUCKET_NAME,
  folderPaths: string | string[] = DEFAULT_FOLDER_PATHS
): Promise<Array<string>> {
  try {
    const fileIndexes: Array<string> = [];
    const paths = Array.isArray(folderPaths) ? folderPaths : [folderPaths];

    for (const folderPath of paths) {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPath, // 폴더 경로
      });

      const response = await s3Client.send(command);

      if (!response.Contents) {
        continue;
      }

      // .md 파일만 필터링하고 등록된 날짜순 (LastModified)으로 정렬
      const sortedFilesByDate = response.Contents.filter(
        object => object.Key && object.Key.endsWith(".md")
      ).sort((a, b) => {
        if (a.LastModified && b.LastModified) {
          return a.LastModified.getTime() - b.LastModified.getTime(); // 등록된 날짜순 정렬
        }
        return 0;
      });

      // .md 파일의 내용을 가져와 dict에 추가
      for (const object of sortedFilesByDate) {
        if (object.Key) {
          fileIndexes.push(object.Key);
        }
      }
    }

    return fileIndexes;
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    return [];
  }
}

// 특정 파일 내용을 가져와 출력
export async function getMarkdownContent(
  path: string, // 파일 경로
  bucketName: string = DEFAULT_BUCKET_NAME
): Promise<MDData> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: path,
  });

  try {
    const response = await s3Client.send(command);
    const stream = response.Body as Readable;
    const content = await streamToString(stream);

    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1].replace(/\.md$/, "");

    const endcodedFileName = encodeToUUIDv4(fileName);

    return {
      id: endcodedFileName,
      path: path,
      title: fileName,
      content: content,
      lastModifiedDate: response.LastModified,
    };
  } catch (error) {
    console.error(`Error fetching content of ${path}:`, error);
    return {
      id: "",
      path: "",
      title: "",
      content: "",
      lastModifiedDate: new Date(),
    };
  }
}

// 모든 마크다운 파일 데이터 가져오기
export async function getAllMarkdownDatas(): Promise<Array<MDData>> {
  const mdTitles = await getMarkdownTitles();
  const mdDatas = await Promise.all(
    mdTitles.map(async title => {
      return await getMarkdownContent(title);
    })
  );
  return mdDatas;
}
