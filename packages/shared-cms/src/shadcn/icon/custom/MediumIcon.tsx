import { BASE_SVG_PROPS, ICON_SIZE_STYLE, type CustomIconSvgProps } from "./icon-renderer.types";

export function MediumIcon({ size, className, style, color, ...rest }: CustomIconSvgProps) {
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
      <circle cx="6.5" cy="12" r="4.5" fill="currentColor" />
      <ellipse cx="14.75" cy="12" rx="3.25" ry="4.75" fill="currentColor" />
      <ellipse cx="20.5" cy="12" rx="1.5" ry="4" fill="currentColor" />
    </svg>
  );
}
