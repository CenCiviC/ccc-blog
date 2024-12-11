"use client";
import React, { useEffect } from "react";
import hljs from "highlight.js";

export default function Code() {
  const con = `if "아우터" == "아우터":
    print("right")
    else:
    print("false")`;

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <pre>
      <code>{con}</code>
    </pre>
  );
}
