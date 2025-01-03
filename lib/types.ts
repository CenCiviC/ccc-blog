export type PostType = {
  title: string;
  content: string;
  createdDate: Date;
  modifiedDate: Date;
};

export type Directory = File | Folder;

export type File = {
  type: "file";
  name: string;
  path: string; // ex. programming/aws/file.md
  content?: string;
};

export type FileData = {
  content: string;
  lastModified: Date | null;
  createdDate: Date | null;
};

export type Folder = {
  type: "folder";
  name: string;
  path: string; // ex. programming/aws/
  subDirectories: Directory[];
};
