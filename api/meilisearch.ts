import { MeiliSearch } from "meilisearch";

const INDEX_NAME = "markdown-file";

const client = new MeiliSearch({
  host: "https://search.kyungbin.im/",
  apiKey: process.env.NEXT_PUBLIC_CCC_MEILISEARCH_API_KEY,
});

export async function addDocuments(
  datas: Array<{ id: string; content: string }>
) {
  try {
    await client.index(INDEX_NAME).addDocuments(datas);
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

export async function deleteAllDocuments() {
  try {
    await client.index(INDEX_NAME).deleteAllDocuments();
    console.log("All documents deleted successfully from index:", INDEX_NAME);
    return { success: true };
  } catch (error) {
    console.error("Error deleting documents:", error);
    throw error;
  }
}
