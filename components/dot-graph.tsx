"use client";

import { useEffect, useRef } from "react";

const NODE_COUNT = 26;

interface GraphNode {
  x: number;
  y: number;
  r: number;
  c: number;
  ph: number;
  sp: number;
}

/* 시드 기반 의사 난수 — 리렌더/리사이즈에도 배치가 안정적이도록 */
function rnd(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 홈 히어로 배경의 Obsidian 그래프 모티프 캔버스.
 * 점(dot) 색은 CSS 토큰(--dot1~5)에서 읽어 라이트/다크를 함께 지원한다.
 */
export default function DotGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    let nodes: GraphNode[] = [];
    let colors: string[] = [];
    let edgeColor = "rgba(148,128,186,0.16)";
    let rafId: number | null = null;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = [
        cs.getPropertyValue("--dot1").trim(),
        cs.getPropertyValue("--dot2").trim(),
        cs.getPropertyValue("--dot3").trim(),
        cs.getPropertyValue("--dot4").trim(),
        cs.getPropertyValue("--dot5").trim(),
      ];
      edgeColor = cs.getPropertyValue("--graph-edge").trim() || edgeColor;
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        // 헤드라인을 가리지 않도록 점을 오른쪽으로 편향
        const bias = 0.34 + 0.66 * rnd(i * 3 + 1);
        nodes.push({
          x: rect.width * bias,
          y: rect.height * (0.08 + 0.84 * rnd(i * 3 + 2)),
          r: 1.8 + 2.2 * rnd(i * 3 + 3),
          c: Math.floor(rnd(i * 7 + 5) * 5) % 5,
          ph: rnd(i * 11 + 9) * Math.PI * 2,
          sp: 0.25 + 0.5 * rnd(i * 13 + 4),
        });
      }
    };

    const draw = (t: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const pts = nodes.map(n => {
        const dx = reduced.matches ? 0 : Math.sin(t * 0.0004 * n.sp + n.ph) * 5;
        const dy = reduced.matches
          ? 0
          : Math.cos(t * 0.00033 * n.sp + n.ph) * 5;
        return { x: n.x + dx, y: n.y + dy, r: n.r, c: n.c };
      });

      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.globalAlpha = 1 - d / 130;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 0.85;
      for (const p of pts) {
        ctx.fillStyle = colors[p.c] || "#9480ba";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      rafId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      readColors();
      layout();
      if (reduced.matches) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        draw(0);
      } else if (rafId === null) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    const onResize = () => {
      layout();
      if (reduced.matches) draw(0);
    };
    const onScheme = () => {
      readColors();
      if (reduced.matches) draw(0);
    };

    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", start);
    darkScheme.addEventListener("change", onScheme);
    start();

    return () => {
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", start);
      darkScheme.removeEventListener("change", onScheme);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
