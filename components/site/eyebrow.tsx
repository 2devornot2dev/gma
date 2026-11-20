import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-knicks",
        className,
      )}
    >
      <span aria-hidden="true" className="h-[3px] w-8 shrink-0 bg-knicks" />
      {children}
    </p>
  );
}