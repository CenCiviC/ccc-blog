export function CopySvg() {
  return (
    <svg
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect width="6" height="4" x="9" y="3" rx="2" />
        <path d="M9 12h6m-6 4h6" />
      </g>
    </svg>
  );
}

export function FileSvg({ isOpend }: { isOpend: boolean }) {
  return (
    <svg
      className=" shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <g
        fill="none"
        stroke={isOpend ? "var(--primary-50)" : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <path d="M14 2v6h6m-4 5H8m8 4H8m2-8H8" />
      </g>
    </svg>
  );
}

export function FolderSvg({ isOpend }: { isOpend: boolean }) {
  return (
    <svg
      className=" shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 42"
      width={20}
      height={20}
    >
      <path
        d="M24.833 12.5H40.25a3.75 3.75 0 0 1 3.745 3.55l.005.2v19a3.75 3.75 0 0 1-3.55 3.745l-.2.005H7.75a3.75 3.75 0 0 1-3.745-3.55L4 35.25V18.999L17.804 19l.226-.007a3.75 3.75 0 0 0 2.547-1.219l.147-.172 4.109-5.102zM17.061 9c.832 0 1.639.277 2.294.784l.175.144 2.444 2.138-3.197 3.968-.094.105c-.2.197-.46.322-.739.353l-.14.008L4 16.499V12.75a3.75 3.75 0 0 1 3.55-3.745L7.75 9h9.31z"
        fill={isOpend ? "#F7BD24" : "#D5A427"}
      />
    </svg>
  );
}
