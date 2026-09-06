import type { ReactNode } from "react";

/**
 * A block of content under a small uppercase label, e.g. "GENERAL".
 */
export default function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400">
        {label}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-neutral-700">
        {children}
      </div>
    </section>
  );
}
