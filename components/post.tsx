"use client";
import React from "react";
import useHlcode from "@/hooks/useHlcode";
import { marked } from "marked";

interface PostProps {
  name: string;
  markdown: string;
}

export default function Post({ name, markdown }: PostProps) {
  useHlcode();

  return (
    <div className=" bg-background">
      <h1>{name}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: marked(markdown),
        }}
      />
    </div>
  );
}
