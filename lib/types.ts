export type MDData = {
  id: string; // uuid v4
  path: string; // 파일 경로 ex. programming/aws/file.md
  title: string; // key에서 확장자와 경로 제거
  content: string;
  lastModifiedDate: Date | undefined;
};

export type Directory = File | Folder;

export type File = {
  type: "file";
  name: string;
  path: string; // ex. programming/aws/file.md
  content?: string;
};

export type Folder = {
  type: "folder";
  name: string;
  path: string; // ex. programming/aws/
  subDirectories: Directory[];
};
