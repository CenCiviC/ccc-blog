import { fetchFileContent, getMarkdownFiles } from "@/api";
import Post from "@/components/post";
import Toc from "./toc";

export default async function DotPage({
  params,
}: {
  params: Promise<{ md: string[] }>;
}) {
  const bucketName = "ccc-blog"; // S3 버킷 이름
  const folderPath = "programming/"; // 폴더 경로
  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));

  const fileData = await fetchFileContent(
    bucketName,
    decodeURIComponent(filePath)
  );
  await getMarkdownFiles(bucketName, folderPath);

  return (
    <div className="flex bg-primary-50 w-full h-full p-[30px]">
      <div className="flex w-[75%] h-full px-8 ">
        <div className="flex flex-col w-full max-w-[820px] mx-auto">
          <Post key={filePath} name={filePath} fileData={fileData} />
        </div>
      </div>
      <div className=" w-[25%] h-full p-8">
        <Toc fileData={fileData} currentPath={filePath} />
      </div>
    </div>
  );
}
