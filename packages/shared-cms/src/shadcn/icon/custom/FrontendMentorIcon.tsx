import { BASE_SVG_PROPS, ICON_SIZE_STYLE, type CustomIconSvgProps } from "./icon-renderer.types";

export function FrontendMentorIcon({
  size,
  className,
  style,
  color,
  ...rest
}: CustomIconSvgProps) {
  return (
    <svg
      {...BASE_SVG_PROPS}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ ...ICON_SIZE_STYLE, ...style }}
      color={color}
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M4 4V20M8 8L14 12L8 16M14 8L20 12L14 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
