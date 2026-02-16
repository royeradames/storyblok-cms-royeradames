import { BASE_SVG_PROPS, ICON_SIZE_STYLE, type CustomIconSvgProps } from "./icon-renderer.types";

export function XComIcon({ size, className, style, color, ...rest }: CustomIconSvgProps) {
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
        d="M3 3H7.05L11.58 9.08L17.03 3H21L13.45 11.44L21 21H16.95L12.08 14.46L6.2 21H2.25L10.21 12.09L3 3ZM7.8 5.55H5.95L16.2 18.45H18.05L7.8 5.55Z"
        fill="currentColor"
      />
    </svg>
  );
}
