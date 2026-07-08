/** Flat oil-drum icon — yellow body + black cap/rim, matching the real Shell Omala
 * 200L drums used on-site. A custom SVG (not the 🛢️ emoji) so the color is ours to
 * control, not whatever the OS emoji font happens to render. */
export function OilDrumIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="5" y="6" width="14" height="15" rx="2" fill="#FFC107" />
      <rect x="5" y="12.5" width="14" height="2.2" fill="#E0A200" />
      <rect x="5" y="2.5" width="14" height="4" rx="1.3" fill="#1A1A1A" />
    </svg>
  );
}
