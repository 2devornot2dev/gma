// components/site/services.tsx
import { Anchor, ShieldCheck, ThermometerSnowflake, Truck } from "lucide-react";
import { Reveal } from "@/components/misc/reveal";

const services = [
  {
    icon: ThermometerSnowflake,
    title: "Cold Chain Logistics",
    description:
      "Continuous active temperature telemetry across multi-temp reefer containers, dry-ice packaging, and dedicated staging depots.",
  },
  {
    icon: Anchor,
    title: "Ocean & Air Freight",
    description:
      "Direct carrier contracts guaranteeing refrigerated container allocation through major North American, European, and Asian ports.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory & Health Certs",
    description:
      "Complete import/export documentation, CFIA/USDA compliance, customs broker clearance, and full traceability certificates.",
  },
  {
    icon: Truck,
    title: "Volume Wholesale Supply",
    description:
      "Contracted supply pipelines for beef, pork, game, seafood, and poultry portioned to enterprise foodservice specifications.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-steel-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal scaleX={0} className="mb-4 h-1 w-16 origin-left bg-knicks" />
          <Reveal delay={0.1}>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-knicks">
              End-to-End Capabilities
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-navy sm:text-5xl">
              Certified Protein Logistics
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={0.15 + idx * 0.08}
                y={24}
                className="group flex flex-col justify-between border border-steel-200 bg-white p-7 shadow-xs transition-colors hover:border-navy"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center bg-navy text-white transition-colors group-hover:bg-knicks">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-black uppercase tracking-wide text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-700">
                    {s.description}
                  </p>
                </div>
                <div className="mt-6 h-0.5 w-0 bg-knicks transition-all duration-300 group-hover:w-full" />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}