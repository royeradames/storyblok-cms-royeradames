import { BASE_SVG_PROPS, ICON_SIZE_STYLE, type CustomIconSvgProps } from "./icon-renderer.types";

export function RoyerAdamesComIcon({
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
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7.3 16.5V7.5H11.7C13.35 7.5 14.35 8.4 14.35 9.85C14.35 11.02 13.65 11.78 12.45 12.03L14.55 16.5H12.62L10.77 12.24H9.02V16.5H7.3ZM9.02 10.95H11.46C12.17 10.95 12.62 10.56 12.62 9.92C12.62 9.29 12.17 8.91 11.46 8.91H9.02V10.95ZM15.22 16.5L18.07 7.5H19.99L22.84 16.5H21.06L20.45 14.45H17.56L16.95 16.5H15.22ZM17.95 13.1H20.05L19.02 9.57L17.95 13.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
