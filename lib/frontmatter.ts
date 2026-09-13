// Obsidian properties(YAML 프론트매터) 처리.
// 목적은 두 가지 - (1) 본문/검색 인덱스에서 프론트매터를 걷어내고,
// (2) 글쓴이가 직접 적은 수정일을 읽어 S3의 LastModified보다 우선 사용한다.
// 의존성 없이 최소한만 파싱한다: 최상단 블록의 `key: value` 스칼라 한 줄들.

export type Frontmatter = Record<string, string>;

export type ParsedMarkdown = {
  data: Frontmatter; // 키는 소문자로 정규화
  content: string; // 프론트매터가 제거된 본문
};

// 파일 맨 앞의 --- ... --- 블록 (BOM/CRLF 허용)
const FRONTMATTER_BLOCK =
  /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

// 수정일로 인정하는 키 - 앞쪽이 우선.
// `updated`는 Update time on edit 플러그인, `date modified`는 Linter 플러그인 기본값.
const DATE_KEYS = ["updated", "date modified", "modified", "lastmod", "date"];

export function parseFrontmatter(markdown: string): ParsedMarkdown {
  const match = FRONTMATTER_BLOCK.exec(markdown);
  if (!match) return { data: {}, content: markdown };

  const data: Frontmatter = {};

  for (const line of match[1].split(/\r?\n/)) {
    // 들여쓰기된 줄(중첩 맵)과 리스트 항목은 스칼라가 아니므로 건너뛴다
    if (!line.trim() || /^[\s-]/.test(line) || line.trimStart().startsWith("#"))
      continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = stripQuotes(line.slice(separator + 1).trim());
    if (key) data[key] = value;
  }

  // 키가 하나도 없으면 프론트매터가 아니라 수평선(---)일 가능성이 크다 - 본문 보존
  if (Object.keys(data).length === 0) return { data: {}, content: markdown };

  return { data, content: markdown.slice(match[0].length) };
}

// 프론트매터에 적힌 수정일. 값이 없거나 해석 불가면 undefined (호출부에서 S3로 폴백)
export function readFrontmatterDate(data: Frontmatter): Date | undefined {
  for (const key of DATE_KEYS) {
    const parsed = parseDateValue(data[key]);
    if (parsed) return parsed;
  }
  return undefined;
}

function stripQuotes(value: string): string {
  const match = /^(["'])([\s\S]*)\1$/.exec(value);
  return match ? match[2] : value;
}

// YYYY-MM-DD / YYYY.MM.DD / YYYY/MM/DD (+ 선택적 시각·타임존)
const DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?\s*(Z|[+-]\d{2}:?\d{2})?$/;

function parseDateValue(raw: string | undefined): Date | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  const match = DATE_PATTERN.exec(value.replace(/[./]/g, "-"));
  if (match) {
    const [, year, month, day, hour, minute, second, zone] = match;
    // 타임존이 없으면 KST로 본다 - UTC로 해석하면 날짜가 하루 밀릴 수 있다
    const offset = zone ? normalizeZone(zone) : "+09:00";
    const time = `${hour ?? "00"}:${minute ?? "00"}:${second ?? "00"}`;
    return toDate(`${year}-${month}-${day}T${time}${offset}`);
  }

  // 그 외 형식(예: Linter의 장황한 기본 포맷)은 Date에 맡긴다
  return toDate(value);
}

function normalizeZone(zone: string): string {
  if (zone === "Z") return "Z";
  return zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
}

function toDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
