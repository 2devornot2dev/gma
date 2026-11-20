import Image from "next/image";
import { Reveal } from "@/components/misc/reveal";
import { Eyebrow } from "./eyebrow";

const certifications = ["USDA", "HACCP", "BRCGS", "Halal", "ISO 22000"];

export function Quality() {
  return (
    <section
      id="quality"
      className="py-20 lg:py-28"
      aria-labelledby="quality-title"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <div className="lg:order-2">
          <Reveal delay={0.2} y={24}>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/img/quality.png"
                alt="Food safety inspector reviewing boxed meat in a processing facility"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:order-1">
          <Reveal delay={0.1}>
            <Eyebrow>Quality &amp; Compliance</Eyebrow>
          </Reveal>

          <Reveal delay={0.2}>
            <h2
              id="quality-title"
              className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-navy sm:text-5xl"
            >
              Inspected at Every Stage.
            </h2>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-6 leading-relaxed text-steel">
              Every shipment is traceable from plant to port. Our QA team audits
              suppliers, verifies documentation, and inspects product before it
              leaves the dock.
            </p>
          </Reveal>

          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Certifications">
            {certifications.map((c, i) => (
              <Reveal
                key={c}
                as="li"
                delay={0.35 + i * 0.06}
                y={12}
                className="border-2 border-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy"
              >
                {c}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}