import Image from "next/image";
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
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/img/quality.png"
              alt="Food safety inspector reviewing boxed meat in a processing facility"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="lg:order-1">
          <Eyebrow>Quality &amp; Compliance</Eyebrow>
          <h2
            id="quality-title"
            className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-navy sm:text-5xl"
          >
            Inspected at Every Stage.
          </h2>
          <p className="mt-6 leading-relaxed text-steel">
            Every shipment is traceable from plant to port. Our QA team audits
            suppliers, verifies documentation, and inspects product before it
            leaves the dock.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Certifications">
            {certifications.map((c) => (
              <li
                key={c}
                className="border-2 border-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}