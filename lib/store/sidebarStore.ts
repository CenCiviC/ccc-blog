import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

// 서버와 클라이언트 모두에서 동일한 초기값 사용
const getInitialState = () => {
  if (typeof window === "undefined") return true; // 서버에서는 항상 true
  return window.innerWidth >= 1024; // 클라이언트에서는 화면 크기에 따라 결정
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: getInitialState(),
  toggleSidebar: () =>
    set((state) => {
      const newIsOpen = !state.isOpen;
      // 모바일에서만 body overflow 처리
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        document.body.style.overflow = newIsOpen ? "hidden" : "";
      }
      return { isOpen: newIsOpen };
    }),
  setIsOpen: (isOpen) => {
    // 모바일에서만 body overflow 처리
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    set({ isOpen });
  },
}));
