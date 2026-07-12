// 필수 환경변수가 없으면 조용히 빈 값으로 진행하지 않고 즉시 실패시킨다
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
