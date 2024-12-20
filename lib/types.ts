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
  path: string;
  content?: string;
};

export type Folder = {
  type: "folder";
  name: string;
  path: string; //programming/aws/
  subDirectories: Directory[];
};
