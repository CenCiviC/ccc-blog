import { useEffect } from "react";
import hljs from "highlight.js";

export default function useHlcode() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
}
