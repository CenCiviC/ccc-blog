// 파일명을 URL-safe한 base64 문자열로 인코딩 (문서 id로 사용)
export function encodeBase64Url(fileName: string): string {
  return Buffer.from(fileName)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// 경로의 각 세그먼트를 percent-encoding (한글/공백 파일명 URL용)
export function encodePathSegments(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
