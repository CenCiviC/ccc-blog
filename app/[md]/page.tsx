import TopBar from "@/components/topbar";

export default async function PostPage({
  params,
}: {
  params: Promise<{ md: string }>;
}) {
  const slug = (await params).md;

  return (
    <main className="flex flex-col w-full h-dvh">
      <TopBar />
      {slug}
    </main>
  );
}
