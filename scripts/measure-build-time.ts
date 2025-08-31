#!/usr/bin/env tsx

import { execSync } from "child_process";

interface BuildMetrics {
  startTime: number;
  endTime: number;
  buildTime: number;
  buildTimeSeconds: number;
}

interface PerformanceAnalysis {
  isSlow: boolean;
  isVerySlow: boolean;
}

export async function measureBuildTime(): Promise<BuildMetrics> {
  const startTime = Date.now();

  try {
    console.log("📦 Next.js 빌드를 시작합니다...");

    // 빌드 실행
    execSync("pnpm run build", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    const endTime = Date.now();
    const buildTime = endTime - startTime;
    const buildTimeSeconds = buildTime / 1000;

    const metrics: BuildMetrics = {
      startTime,
      endTime,
      buildTime,
      buildTimeSeconds,
    };

    console.log("\n✅ 빌드가 완료되었습니다!");
    console.log(
      `⏱️  총 빌드 시간: ${metrics.buildTime}ms (${metrics.buildTimeSeconds.toFixed(2)}초)`
    );

    return metrics;
  } catch (error) {
    console.error(
      "\n❌ 빌드 중 오류가 발생했습니다:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export function analyzePerformance(metrics: BuildMetrics): PerformanceAnalysis {
  const isSlow = metrics.buildTime > 30000; // 30초 이상
  const isVerySlow = metrics.buildTime > 60000; // 1분 이상

  return { isSlow, isVerySlow };
}

export function displayAnalysis(analysis: PerformanceAnalysis): void {
  console.log("\n📊 성능 분석:");

  if (analysis.isVerySlow) {
    console.log("⚠️  빌드 시간이 1분을 초과했습니다.");
  } else if (analysis.isSlow) {
    console.log("⚠️  빌드 시간이 30초를 초과했습니다.");
  } else {
    console.log("✅ 빌드 시간이 양호합니다.");
  }
}

// CLI에서 직접 실행할 때 사용
async function main(): Promise<void> {
  console.log("🚀 빌드 시간 측정을 시작합니다...\n");

  try {
    const metrics = await measureBuildTime();
    const analysis = analyzePerformance(metrics);
    displayAnalysis(analysis);
  } catch (error) {
    console.error(
      "\n❌ 빌드 중 오류가 발생했습니다:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
