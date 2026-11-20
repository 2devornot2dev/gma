// components/site/process.tsx
import { Reveal } from "@/components/misc/reveal";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Request a Quote", description: "Share product, volume, and destination." },
  { title: "Confirm Specs", description: "We align cuts, packing, and pricing." },
  { title: "Ship & Track", description: "Reefer booking with live visibility." },
  { title: "Deliver", description: "Cleared, inspected, and on your dock." },
];

export function Process() {
  return (
    <section
      className="border-y border-steel-100 bg-steel-50 py-20 lg:py-24"
      aria-labelledby="process-title"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-knicks">
              How It Works
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2
              id="process-title"
              className="mt-4 font-display text-3xl font-black uppercase tracking-tight text-navy sm:text-5xl"
            >
              From Order to Dock
            </h2>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              key={s.title}
              as="li"
              delay={0.15 + i * 0.1}
              className={cn(
                "border-t-4 pt-6",
                i === steps.length - 1 ? "border-knicks" : "border-navy",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-knicks">
                Step {i + 1}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold uppercase text-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-steel">{s.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}