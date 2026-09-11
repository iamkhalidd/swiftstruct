import type { SVGProps } from 'react';

/**
 * Custom outline glyphs drawn to match the Heroicons 24/outline style
 * (24x24 viewBox, 1.5 stroke, round caps and joins).
 *
 * These exist because Heroicons has no real-estate spec icons — there is no
 * bed, bath, or parking glyph in the set, and substituting a generic icon
 * (a house for "3 beds") reads as a mistake. Keeping them here means the
 * whole icon surface stays visually consistent.
 */
type IconProps = SVGProps<SVGSVGElement>;

function OutlineIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M3 19v-9" />
      <path d="M3 13h17a1 1 0 0 1 1 1v5" />
      <path d="M3 17h18" />
      <path d="M7 13V9.5A1.5 1.5 0 0 1 8.5 8h4A1.5 1.5 0 0 1 14 9.5V13" />
    </OutlineIcon>
  );
}

export function BathIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M3 11h18v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4Z" />
      <path d="M6.5 11V7a2 2 0 0 1 2-2h2a1 1 0 0 1 1 1v1" />
      <path d="M9.5 6.5h.01" />
    </OutlineIcon>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M4.5 16.5V13l1.7-4.2A1.6 1.6 0 0 1 7.7 8h8.6a1.6 1.6 0 0 1 1.5.8l1.7 4.2v3.5" />
      <path d="M3.5 16.5h17" />
      <path d="M5 16.5V19" />
      <path d="M19 16.5V19" />
      <circle cx="7.75" cy="13.25" r="1.25" />
      <circle cx="16.25" cy="13.25" r="1.25" />
    </OutlineIcon>
  );
}
