import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>(set => ({
  // 모바일 드로어의 열림 상태. 데스크톱 표시는 CSS(lg:flex)가 담당하므로
  // 서버/클라이언트 모두 false로 시작해 하이드레이션 불일치를 없앤다.
  isOpen: false,
  toggleSidebar: () =>
    set(state => {
      const newIsOpen = !state.isOpen;
      // 모바일에서만 body overflow 처리
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        document.body.style.overflow = newIsOpen ? "hidden" : "";
      }
      return { isOpen: newIsOpen };
    }),
  setIsOpen: isOpen => {
    // 모바일에서만 body overflow 처리
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    set({ isOpen });
  },
}));
