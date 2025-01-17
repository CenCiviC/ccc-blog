import cn from "classnames";

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

export function FileSvg({
  isOpend,
  size = 20,
  className,
}: {
  isOpend: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={cn(" shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
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
export function QuestionMarkSvg({
  color = "black",
  size = 24,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
    >
      <path
        d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function DotsSvg({
  color = "black",
  size = 24,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      strokeWidth="1.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
    >
      <path
        d="M5.164 17a17.47 17.47 0 0 1 1.132-3M11.5 7.794A16.838 16.838 0 0 1 14 6.296M4.5 22a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm10-5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MagnifyingGlassSvg({
  color = "black",
  size = 24,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg fill={color} height={size} width={size} viewBox="0 0 490.4 490.4">
      <g>
        <path
          d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796
   s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z
    M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"
        />
      </g>
    </svg>
  );
}
