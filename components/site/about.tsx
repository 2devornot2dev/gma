// components/site/about.tsx
import { Reveal } from "@/components/misc/reveal";

const stats = [
  { value: "6", label: "Continents Served" },
  { value: "100%", label: "Temperature Controlled" },
  { value: "137+", label: "Wholesale Cuts & Products" },
  { value: "24/7", label: "Cold-Chain Telemetry" },
];

export function About() {
  return (
    <section id="about" className="bg-navy py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {/* Draws orange line left-to-right on scroll */}
            <Reveal
              scaleX={0}
              className="mb-6 h-1 w-20 origin-left bg-knicks"
            />
            <Reveal delay={0.1}>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-knicks">
                Operational Excellence
              </span>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Global Scale.
                <br />
                Strict Cold Chain.
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-col justify-between space-y-8 lg:col-span-7">
            <Reveal delay={0.25}>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                GMA operates at the intersection of international livestock
                producers and enterprise foodservice buyers. Every cut is tracked
                from certified processing facilities through ocean containers to
                final customs release without broken thermal links.
              </p>
            </Reveal>

            {/* Staggered stats grid */}
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.3 + i * 0.08} y={16}>
                  <div className="font-mono text-3xl font-black text-knicks sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider text-steel-300">
                    {stat.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}