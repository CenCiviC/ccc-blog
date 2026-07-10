# CENCIVIC BLOG REPO

> link : https://kyungbin.im

A personal blog built with Next.js that transforms Obsidian markdown notes into a web publication. Inspired by Steve Jobs' "connecting the dots" philosophy, this blog serves as a personal knowledge base where thoughts and ideas are interconnected.

## Features

- **Markdown-based**: Write posts in Obsidian and sync them to AWS S3
- **Instant publish**: `scripts/sync-obsidian.sh` syncs the vault to S3 and revalidates only the changed pages (on-demand ISR + cache prewarming)
- **Search**: Self-hosted full-text search — a static index (`/api/search-index`) is generated at build/revalidate time and searched in the browser (no search server)
- **Code highlighting**: Syntax highlighting for code blocks using highlight.js
- **Table of contents**: Auto-generated TOC for better navigation

### Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- AWS S3 (content storage)
- Marked (markdown parser)

## Publishing flow

```
Obsidian vault
  └─ scripts/sync-obsidian.sh
       ├─ aws s3 sync (.md + attachment/, --delete)
       └─ POST /api/revalidate  (x-revalidate-secret 헤더 필요)
            ├─ update        → 해당 포스트 페이지만 재생성
            ├─ create/delete → 사이드바 포함 /dot 전체 재생성
            ├─ 검색 인덱스(/api/search-index)와 sitemap 갱신
            └─ 재생성된 페이지를 미리 fetch해서 캐시 프리워밍
```

Required env: `CCC_REVALIDATE_SECRET`, `CCC_SITE_URL` (+ 기존 AWS/CDN 키)

## TODO

- rust markdown parser
