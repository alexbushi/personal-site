import type { ReactNode } from "react";

/**
 * A wide black pill button with a label on the left and an arrow on the right.
 *
 * The whole button scales up slightly on hover and dips on press. Both are
 * disabled under `prefers-reduced-motion`, which is what `motion-reduce`
 * hooks into — some people get motion sickness from scaling UI.
 */
export default function LinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group inline-flex items-center gap-6
        rounded-full bg-neutral-900 py-3.5 pl-7 pr-6
        text-[15px] font-medium text-white
        transition-transform duration-200 ease-out
        hover:scale-[1.02] active:scale-[0.99]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
        motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100
      "
    >
      <span>{children}</span>

      {/* Arrow drifts up and to the right as the button grows. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="
          h-5 w-5 shrink-0
          transition-transform duration-200 ease-out
          group-hover:translate-x-0.5 group-hover:-translate-y-0.5
          motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0
        "
      >
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </a>
  );
}
