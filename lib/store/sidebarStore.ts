import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const getInitialState = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= 1024; // lg 브레이크포인트
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

// 리사이즈 이벤트 처리
if (typeof window !== "undefined") {
  const handleResize = () => {
    const shouldBeOpen = window.innerWidth >= 1024;
    useSidebarStore.getState().setIsOpen(shouldBeOpen);
    // 데스크톱 사이즈에서는 overflow 제거
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = "";
    }
  };

  window.addEventListener("resize", handleResize);
}
