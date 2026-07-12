import type { Folder } from "@/lib/types";

// S3 키 목록으로 사이드바용 폴더 트리를 만든다.
// 정렬(폴더 우선, 이름순)까지 여기서 끝내므로 렌더링 쪽은 순서 그대로 그리면 된다.
export function buildFileTree(keys: string[]): Folder {
  const root: Folder = {
    type: "folder",
    name: "root",
    path: "",
    subDirectories: [],
  };

  for (const key of keys) {
    const segments = key.split("/");
    const fileName = segments.pop()?.replace(/\.md$/, "") ?? "";

    let parent = root;
    for (const segment of segments) {
      let folder = parent.subDirectories.find(
        (child): child is Folder =>
          child.type === "folder" && child.name === segment
      );

      if (!folder) {
        folder = {
          type: "folder",
          name: segment,
          // 상위 경로를 포함한 전체 경로 (열림 판정에 사용되므로 유일해야 한다)
          path: `${parent.path}${segment}/`,
          subDirectories: [],
        };
        parent.subDirectories.push(folder);
      }

      parent = folder;
    }

    parent.subDirectories.push({ type: "file", name: fileName, path: key });
  }

  sortTree(root);
  return root;
}

function sortTree(node: Folder) {
  node.subDirectories.sort((a, b) => {
    // 폴더를 파일보다 먼저 보여준다
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, ["ko", "en"], { sensitivity: "base" });
  });

  for (const sub of node.subDirectories) {
    if (sub.type === "folder") sortTree(sub);
  }
}
