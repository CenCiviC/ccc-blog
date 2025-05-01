import TopBar from "@/components/topbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <TopBar hasMenuBtn={false} />
      <div className="flex flex-1 w-full">
        <div className="flex flex-col bg-primary-50 w-full h-full px-4 md:px-8 py-8">
          <div className="w-full max-w-3xl mx-auto space-y-12">
            {/* 환영 섹션 */}
            <section className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                👋 임경빈의 블로그에 온 걸 환영합니다
              </h3>
              <div className="space-y-2 text-sm md:text-base leading-relaxed">
                <p>
                  이 블로그는 스티브 잡스의 연설,{" "}
                  <strong className="text-[--h1-color]">
                    &ldquo;connecting the dots&rdquo;
                  </strong>
                  에서 영감을 받아 만들어졌습니다.
                </p>
                <p>
                  스티븐 잡스는 현재를 하나의 점으로 말하며 &ldquo;누구도 미래를
                  예측할 수는 없지만 현재 각자가 자신의 자리에서 하고 있는
                  노력이 미래에 어떤 식으로든 연결이 될 거라는 믿음을 가져야만
                  한다&rdquo;라고 표현했습니다.
                </p>
                <p>
                  점은 크기가 없지만 점들이 모인 선과 면은 한없이 커질 수 있는
                  것처럼 서로 관련 없는 조각들이지만, 언젠가 이 점들이 선이 되어
                  저만의 그림을 완성하리라는 믿음으로 만들어가고 있습니다.
                </p>
              </div>
            </section>

            <hr className="border-sub-200" />

            {/* Obsidian 섹션 */}
            <section className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Obsidian으로 생각을 쌓다
              </h3>
              <div className="space-y-4 text-sm md:text-base leading-relaxed">
                <p>
                  이러한 방향성을 가장 잘 시각화할 수 있는 도구가 바로{" "}
                  <strong className="text-[--h1-color]">Obsidian</strong>이라는
                  앱이었습니다.
                  <br />
                  마크다운으로 작성하여 생각의 흐름을 노드와 선으로 연결해주는
                  이 앱은 브레인스토밍 이상의 의미를 담고 있습니다.
                </p>
                <p>
                  저는 매일같이 Obsidian에 글을 쓰고 있습니다. 아직은 많지 않은
                  점이지만 저만의 그림을 완성해갈 것입니다.
                </p>
                <div className="flex justify-center my-6">
                  <Image
                    src="https://dengtukgi5sf7.cloudfront.net/attachment/스크린샷%202025-04-21%20오전%2012.46.57.png"
                    alt="Obsidian 그래프 뷰"
                    width={400}
                    height={200}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </section>

            <hr className="border-sub-200" />

            {/* 블로그 소개 섹션 */}
            <section className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                내가 보기 위한 블로그
              </h3>
              <div className="space-y-2 text-sm md:text-base leading-relaxed">
                <p>
                  이 블로그는 누군가에게 보여주기 위한 공간이 아닙니다.
                  <br />
                  오히려 오롯이{" "}
                  <strong className="text-[--h1-color]">
                    저를 위한 기록 공간
                  </strong>
                  입니다.
                  <br />
                  때문에 사용자 경험이 다소 부족하거나 불편하게 느껴질 수도
                  있습니다.
                </p>
                <p>
                  하지만 그 또한 이 블로그가 지향하는 방식입니다.
                  <br />
                  기록은 내 안의 생각을 꺼내 정리하는 과정이고, 이 과정은 남보다
                  나에게 최적화되어야 하기 때문입니다.
                </p>
              </div>
            </section>

            <hr className="border-sub-200" />

            {/* 시스템 설명 섹션 */}
            <section className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Markdown → S3 → Web: 최소한의 블로깅 시스템
              </h3>
              <div className="space-y-4 text-sm md:text-base leading-relaxed">
                <p>
                  <strong className="text-[--h1-color]">
                    Obsidian에서 작성한 Markdown 파일
                  </strong>
                  은<br />→ 로컬에서{" "}
                  <strong className="text-[--h1-color]">S3 버킷</strong>에
                  자동으로 동기화되고,
                  <br />→ 다시 내가 원하는 일부 폴더만 선별해{" "}
                  <strong className="text-[--h1-color]">
                    웹사이트로 렌더링
                  </strong>
                  됩니다.
                </p>
                <div className="flex justify-center my-6">
                  <Image
                    src="https://dengtukgi5sf7.cloudfront.net/attachment/struc.png"
                    alt="블로그 구조도"
                    width={400}
                    height={200}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <p>
                  복잡한 CMS나 에디터 없이,
                  <br />
                  기록에서 발행까지의 시간을 최소화하는 구조를 만들었습니다.
                  <br />
                  덕분에{" "}
                  <strong className="text-[--h1-color]">
                    기록 자체에 집중할 수 있는 환경
                  </strong>
                  을 갖추게 되었습니다.
                </p>
              </div>
            </section>

            <hr className="border-sub-200" />

            {/* 마무리 섹션 */}
            <section className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">앞으로의 방향</h3>
              <div className="space-y-2 text-sm md:text-base leading-relaxed">
                <p>
                  아직은 저만을 위한 공간이지만,
                  <br />
                  언젠가는 이 점들이 선이 되어, 다른 누군가의 생각과도 연결되길
                  바랍니다.
                </p>
                <p>
                  앞으로는 댓글 기능을 추가하거나, 글을 더 구조화하여
                  <br />
                  조금 더 열려 있는 형태로 만들어갈 예정입니다.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
