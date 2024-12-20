import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({
  region: "ap-northeast-2", // 버킷의 aws 리전
  credentials: {
    accessKeyId: process.env.CCC_AWS_ACCESS_KEY ?? "", // 사용자 생성 시 발급받은 액세스 키
    secretAccessKey: process.env.CCC_AWS_SECRET_KEY ?? "", // 사용자 생성 시 발급받은 비밀 액세스 키
  },
});

// S3에서 특정 버킷과 폴더의 md 파일 가져오기
export async function getMarkdownFiles(
  bucketName: string,
  folderPath: string
): Promise<Record<string, string>> {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folderPath, // 폴더 경로
  });

  try {
    const fileContents: Record<string, string> = {};

    const response = await s3Client.send(command);

    if (!response.Contents) {
      console.log("No files found in the specified folder.");
      return fileContents;
    }

    // .md 파일만 필터링하고 등록된 날짜순 (LastModified)으로 정렬
    const sortedFiles = response.Contents.filter(
      (object) => object.Key && object.Key.endsWith(".md")
    ).sort((a, b) => {
      if (a.LastModified && b.LastModified) {
        return a.LastModified.getTime() - b.LastModified.getTime(); // 등록된 날짜순 정렬
      }
      return 0;
    });

    // .md 파일의 내용을 가져와 dict에 추가
    for (const object of sortedFiles) {
      if (object.Key) {
        const content = await fetchFileContent(bucketName, object.Key);
        fileContents[object.Key] = content; // dict에 key-value 추가
      }
    }

    return fileContents;
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    return {};
  }
}

export async function getFilesTitle(
  bucketName: string,
  folderPath: string
): Promise<Array<string>> {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folderPath, // 폴더 경로
  });

  try {
    const fileIndexes: Array<string> = [];

    const response = await s3Client.send(command);

    if (!response.Contents) {
      console.log("No files found in the specified folder.");
      return fileIndexes;
    }

    // .md 파일만 필터링하고 등록된 날짜순 (LastModified)으로 정렬
    const sortedFiles = response.Contents.filter(
      (object) => object.Key && object.Key.endsWith(".md")
    ).sort((a, b) => {
      if (a.LastModified && b.LastModified) {
        return a.LastModified.getTime() - b.LastModified.getTime(); // 등록된 날짜순 정렬
      }
      return 0;
    });

    // .md 파일의 내용을 가져와 dict에 추가
    for (const object of sortedFiles) {
      if (object.Key) {
        fileIndexes.push(object.Key);
      }
    }

    return fileIndexes;
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    return [];
  }
}

// 특정 파일 내용을 가져와 출력
export async function fetchFileContent(bucketName: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    const stream = response.Body as Readable;
    const content = await streamToString(stream);

    return content;
  } catch (error) {
    console.error(`Error fetching content of ${key}:`, error);
    return "";
  }
}

// Readable Stream -> String 변환
function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
}
