import { MeiliSearch } from "meilisearch";

const BUCKET_NAME = "ccc-blog";
const FOLDER_PATH = "programming/";
const INDEX_NAME = "markdown-file";

const client = new MeiliSearch({
  host: "https://search.kyungbin.im/",
  apiKey: process.env.CCC_MEILISEARCH_API_KEY,
});

export async function addDocuments(
  datas: Array<{ id: string; content: string }>
) {
  try {
    await client.index(INDEX_NAME).addDocuments(datas);
    console.log("Documents added successfully");
  } catch (error) {
    console.error("Error adding documents:", error);
  }
}

export async function searchDocuments(searchQuery: string) {
  const results = await client.index(INDEX_NAME).search(searchQuery, {
    limit: 5,
    attributesToHighlight: ["content", "title"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
    attributesToCrop: ["content"],
    cropLength: 10,
    cropMarker: "...",
  });
  return results;
}
