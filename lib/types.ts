export type PostType = {
  title: string;
  content: string;
  createdDate: Date;
  modifiedDate: Date;
};

export type NodeType = FileNode | FolderNode;

export type FileNode = {
  type: "file";
  name: string;
  content: string;
};

export type FolderNode = {
  type: "folder";
  name: string;
  children: NodeType[];
};
