/**
 * The footer mark: two small dots, black and green — a quiet end-of-page
 * accent picked up from the VoltShip dashboard palette.
 *
 * The green comes from `--color-accent` in globals.css.
 */
export default function SiteMark() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
    </span>
  );
}
