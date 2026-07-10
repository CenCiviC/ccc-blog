// 자체 검색 엔진 - 서버에서 인덱스(JSON)를 정적 생성하고,
// 클라이언트가 한 번 받아 브라우저 메모리에서 검색한다. (외부 검색 서버 불필요)

export type SearchDocument = {
  id: string;
  path: string; // ex. programming/aws/file.md
  title: string;
  content: string; // 마크다운 문법이 제거된 평문
};

// 하이라이트 렌더링용 조각 - match인 부분만 <mark>로 감싼다
export type Segment = {
  text: string;
  match: boolean;
};

export type SearchResult = {
  id: string;
  path: string;
  title: Segment[];
  snippet: Segment[];
  score: number;
};

const SNIPPET_BEFORE = 20; // 첫 매치 앞에 보여줄 글자 수
const SNIPPET_LENGTH = 90; // 스니펫 전체 길이

// 마크다운 문법을 제거해 검색용 평문으로 변환
export function stripMarkdown(markdown: string): string {
  return (
    markdown
      // 코드펜스 마커 제거 (코드 내용은 검색 대상으로 유지)
      .replace(/^```[^\n]*$/gm, "")
      // 이미지: alt 텍스트만 유지
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 옵시디언 위키링크: [[path|alias]] -> alias, [[path]] -> path
      .replace(/!?\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/!?\[\[([^\]]+)\]\]/g, "$1")
      // 링크: 텍스트만 유지
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // html 태그 제거
      .replace(/<[^>]+>/g, "")
      // 헤딩/인용 마커 제거
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      // 강조/인라인코드 마커 제거
      .replace(/(\*\*|__|\*|_|~~|`)/g, "")
      // 공백 정리
      .replace(/\s+/g, " ")
      .trim()
  );
}

// 대소문자 무시 매칭을 위한 정규화
function normalize(text: string): string {
  return text.toLowerCase();
}

// text 안에서 terms가 등장하는 [시작, 끝) 구간들을 찾아 병합
function findMatchRanges(
  text: string,
  terms: string[]
): Array<[number, number]> {
  const normalized = normalize(text);
  const ranges: Array<[number, number]> = [];

  for (const term of terms) {
    let index = normalized.indexOf(term);
    while (index !== -1) {
      ranges.push([index, index + term.length]);
      index = normalized.indexOf(term, index + 1);
    }
  }

  // 시작 위치순 정렬 후 겹치는 구간 병합
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) {
      last[1] = Math.max(last[1], range[1]);
    } else {
      merged.push([...range]);
    }
  }
  return merged;
}

// 매치 구간 기준으로 텍스트를 Segment 배열로 자른다
function toSegments(text: string, ranges: Array<[number, number]>): Segment[] {
  if (ranges.length === 0) return [{ text, match: false }];

  const segments: Segment[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (cursor < start) {
      segments.push({ text: text.slice(cursor, start), match: false });
    }
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }
  return segments;
}

// 첫 매치 주변으로 스니펫을 잘라 Segment로 반환
function buildSnippet(content: string, terms: string[]): Segment[] {
  const ranges = findMatchRanges(content, terms);
  const firstMatch = ranges.length > 0 ? ranges[0][0] : 0;

  const start = Math.max(0, firstMatch - SNIPPET_BEFORE);
  const end = Math.min(content.length, start + SNIPPET_LENGTH);
  const snippetText = content.slice(start, end);

  const snippetRanges: Array<[number, number]> = ranges
    .filter(([s, e]) => e > start && s < end)
    .map(([s, e]) => [
      Math.max(s - start, 0),
      Math.min(e - start, end - start),
    ]);

  const segments = toSegments(snippetText, snippetRanges);
  if (start > 0) segments.unshift({ text: "…", match: false });
  if (end < content.length) segments.push({ text: "…", match: false });
  return segments;
}

// 검색 - 모든 term이 (제목 + 본문)에 존재하는 문서만 매치.
// 제목 매치를 본문 매치보다 훨씬 높게 스코어링한다.
export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  limit: number = 8
): SearchResult[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const doc of documents) {
    const title = normalize(doc.title);
    const content = normalize(doc.content);

    let score = 0;
    let matchesAll = true;

    for (const term of terms) {
      const inTitle = title.includes(term);
      const contentCount = countOccurrences(content, term);

      if (!inTitle && contentCount === 0) {
        matchesAll = false;
        break;
      }

      if (inTitle) {
        score += title.startsWith(term) ? 30 : 20;
      }
      score += Math.min(contentCount, 10); // 본문 등장 횟수 (과도한 반복은 캡)
    }

    if (!matchesAll) continue;

    results.push({
      id: doc.id,
      path: doc.path,
      title: toSegments(doc.title, findMatchRanges(doc.title, terms)),
      snippet: buildSnippet(doc.content, terms),
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

function countOccurrences(text: string, term: string): number {
  let count = 0;
  let index = text.indexOf(term);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(term, index + term.length);
  }
  return count;
}
