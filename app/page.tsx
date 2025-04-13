import TopBar from "@/components/topbar";

export default function Home() {
  return (
    <>
      <TopBar hasMenuBtn={false} />
      <div className="flex flex-1 w-full">
        <div className="flex bg-primary-50 w-full h-full">
          블로그를 소개하는 페이지입니다.
        </div>
      </div>
    </>
  );
}
