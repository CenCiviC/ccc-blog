export function encodeToUUIDv4(fileName: string): string {
  return Buffer.from(fileName)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
