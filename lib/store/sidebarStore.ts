import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
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
