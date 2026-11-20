import Image from "next/image";
import { Reveal } from "@/components/misc/reveal";
import { Eyebrow } from "./eyebrow";

const products = [
  {
    name: "Beef",
    image: "/img/beef.png",
    alt: "Premium raw ribeye and striploin beef cuts",
    description:
      "Grain & grass-fed primals, subprimals, trimmings, and offal from approved plants.",
    cuts: "Ribeye · Striploin · Chuck · Brisket",
  },
  {
    name: "Pork",
    image: "/img/pork.png",
    alt: "Raw pork loin and pork chops",
    description:
      "Loins, bellies, shoulders, and ribs, available bone-in or boneless at volume.",
    cuts: "Loin · Belly · Butt · Spare Ribs",
  },
  {
    name: "Poultry",
    image: "/img/poultry.png",
    alt: "Raw whole chickens and chicken breasts",
    description:
      "Whole birds, breast, leg quarters, and wings with halal options available.",
    cuts: "Whole · Breast · Leg Quarters · Wings",
  },
];

export function Products() {
  return (
    <section
      id="products"
      className="bg-steel-50 py-20 lg:py-28"
      aria-labelledby="products-title"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal delay={0.1}>
              <Eyebrow>Our Products</Eyebrow>
            </Reveal>
            <Reveal delay={0.2}>
              <h2
                id="products-title"
                className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-navy sm:text-5xl"
              >
                Premium Protein. Every Category.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <p className="max-w-md leading-relaxed text-steel">
              Fresh, chilled, and frozen. Bulk boxed, retail-ready, or custom-cut
              to specification.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <Reveal
              key={p.name}
              as="article"
              delay={0.15 + i * 0.1}
              className="group bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="border-t-4 border-knicks p-7">
                <h3 className="font-display text-2xl font-black uppercase text-navy">
                  {p.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  {p.description}
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-steel-300">
                  {p.cuts}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}