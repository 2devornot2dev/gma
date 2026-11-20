import { Eyebrow } from "./eyebrow";

const services = [
  {
    title: "Import",
    description:
      "Sourcing from verified global producers, cleared and delivered to your facility.",
  },
  {
    title: "Export",
    description:
      "Market access for producers with buyer matching and export certification.",
  },
  {
    title: "Cold Chain Logistics",
    description:
      "Reefer freight, bonded storage, and live temperature monitoring door to door.",
  },
  {
    title: "Compliance",
    description:
      "Health certificates, customs filings, and labeling handled by our in-house team.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="bg-navy py-20 text-white lg:py-28"
      aria-labelledby="services-title"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Eyebrow>What We Do</Eyebrow>
        <h2
          id="services-title"
          className="max-w-3xl font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl"
        >
          End-to-End Trade Solutions
        </h2>

        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <div key={s.title} className="bg-navy p-8">
              <p className="font-display text-5xl font-black text-knicks">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 font-display text-xl font-bold uppercase">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}