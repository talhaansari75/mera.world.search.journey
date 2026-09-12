import { cn } from "@/lib/utils";

export function LexoraMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="7" fill="var(--color-paper)" />
      <rect
        x="1.2"
        y="1.2"
        width="29.6"
        height="29.6"
        rx="7"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.2"
      />
      <text
        x="16"
        y="22.5"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontSize="16"
        fontWeight="600"
        fill="var(--color-primary)"
      >
        L
      </text>
    </svg>
  );
}
