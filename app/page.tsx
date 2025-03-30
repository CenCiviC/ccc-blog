import TopBar from "@/components/topbar";

export default function Home() {
  return (
    <>
      <TopBar hasMenuBtn={false} />
      <div className="flex flex-1 w-full">
        <div className="flex bg-primary-50 w-full h-full">
          description of the imkyungbin
        </div>
      </div>
    </>
  );
}
