import { Octokit } from "octokit";

const GIT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_GIT_ACCESS_TOKEN;
const OWNER = process.env.NEXT_PUBLIC_OWNER ?? "";
const REPO = process.env.NEXT_PUBLIC_REPO_NAME ?? "";
const PATH = "programming";

const octokit = new Octokit({
  auth: GIT_ACCESS_TOKEN,
});

export const getRawPosts = async () => {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        mediaType: {
          format: "text",
        },
        owner: OWNER,
        repo: REPO,
        path: PATH,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return data;
  } catch (err) {
    throw new Error(`Failed to get: ${err}`);
  }
};

export const getPostBlobData = async (sha: string) => {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
      {
        owner: OWNER,
        repo: REPO,
        file_sha: sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return data;
  } catch (err) {
    throw new Error(`Failed to get: ${err}`);
  }
};
