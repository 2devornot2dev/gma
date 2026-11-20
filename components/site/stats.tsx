import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Countries Served",
    value: "40+",
    cell: "border-b border-r border-white/10 lg:border-b-0",
  },
  {
    label: "Tons Shipped / Yr",
    value: "120K",
    cell: "border-b border-white/10 lg:border-b-0 lg:border-r",
  },
  {
    label: "Years in Trade",
    value: "25",
    cell: "border-r border-white/10",
  },
  {
    label: "On-Time Delivery",
    value: "99.2%",
    cell: "",
    accent: true,
  },
];

export function Stats() {
  return (
    <section aria-label="Company at a glance" className="bg-navy">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn("px-5 py-8 lg:px-8 lg:py-10", s.cell)}
          >
            <dt className="text-xs font-semibold uppercase tracking-widest text-white/60">
              {s.label}
            </dt>
            <dd
              className={cn(
                "mt-2 font-display text-4xl font-black lg:text-5xl",
                s.accent ? "text-knicks" : "text-white",
              )}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}